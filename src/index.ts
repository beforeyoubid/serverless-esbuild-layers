import fs from 'fs';
import path from 'path';
import del from 'del';
import pascalcase from 'pascalcase';
import minifyAll from 'minify-all-js';

import type Serverless from 'serverless';
import type Plugin from 'serverless/classes/Plugin';
import type { CloudFormationResource, Output } from 'serverless/aws';

import {
  PackageJsonFile,
  Layer,
  Packager,
  Config,
  LevelName,
  TransformedLayerResources,
  Maybe,
  FunctionLayerReference,
} from './types';
import { PACKAGER_ADD_COMMAND, PACKAGER_INSTALL_COMMAND, PACKAGER_LOCK_FILE_NAMES } from './constants';
import { compileConfig, getExternalModules, getLayers, exec } from './utils';
import { Log } from './logger';

const basePath = process.cwd();

/**
 * the esbuild layers plugin class
 *
 * designed to identify which modules needed for a class and to install them
 */
class EsbuildLayersPlugin implements Plugin {
  hooks: Plugin['hooks'];
  serverless: Serverless;
  region: string;
  packager: Packager;
  config: Config;
  level: LevelName;
  log: Plugin.Logging['log'];
  installedLayerNames: Set<string>;

  /**
   * plugin constructor
   * @param serverless the serverless instance
   */
  constructor(serverless: Serverless, options: Serverless.Options, logging?: Plugin.Logging) {
    this.hooks = {
      'package:initialize': this.installLayers.bind(this),
      'after:package:createDeploymentArtifacts': this.transformLayerResources.bind(this),
      'after:aws:package:finalize:mergeCustomProviderResources': this.transformLayerResources.bind(this),
      'before:deploy:deploy': this.transformLayerResources.bind(this),
    };
    this.installedLayerNames = new Set();

    this.serverless = serverless;
    this.region = serverless.service.provider.region;
    this.config = compileConfig(serverless.service.custom['esbuild-layers'] ?? {});
    this.level = options.verbose ? 'verbose' : this.config.level;
    this.log = logging?.log ?? Log(this.level);

    const packager = this.config.packager;
    if (packager === 'auto') {
      this.packager = this.identifyPackager();
    } else {
      this.packager = packager;
    }
  }

  /**
   * function to identify which packager is being used (npm, yarn, pnpm)
   *
   * this works by identifying which lock file is being used
   * @returns the name of the packager being used
   */
  identifyPackager(): Packager {
    const lockMatches = Object.entries(PACKAGER_LOCK_FILE_NAMES).reduce(
      (current, [packager, lockFile]) => ({
        ...current,
        [packager]: fs.existsSync(path.join(basePath, lockFile)),
      }),
      {} as Record<Packager, boolean>
    );
    const matches = Object.entries(lockMatches)
      .filter(([, exists]) => exists)
      .map(([name]) => name) as Packager[];
    if (matches.length === 0) {
      throw new Error('Unable to find your packager. Please set it in config');
    }
    if (matches.length > 1) {
      throw new Error(
        `More than one packager present (${matches.join(
          ', '
        )}). Please choose your preferred packager by setting it in config.`
      );
    }
    const [match] = matches;
    this.log.verbose(`Matched ${match} as the packager based on present lock files`);
    return match;
  }

  /**
   * function to install all layers
   *
   * this runs as a serverless hook
   *
   * @returns a list of installed layers
   */
  async installLayers(): Promise<{ installedLayers: Layer[] }> {
    const installedLayers: Layer[] = [];
    const layers = getLayers(this.serverless);
    for (const [name, layer] of Object.entries(layers)) {
      const installed = await this.installLayer(layer, name);
      if (!installed) continue;
      await this.cleanup(layer.path);
      installedLayers.push(layer);
      this.installedLayerNames.add(name);
    }
    this.log.info(`Installed ${installedLayers.length} layer${installedLayers.length > 1 ? 's' : ''}`);
    return { installedLayers };
  }
  /**
   * locate the node modules used for a particular layer
   *
   * done so by:
   *  1. identifying the entries by the functions attached to each layer
   *  2. using those entries to locate all node externals
   *  3. resolve those entries back to their version specified (in either the base package.json or their installed version)
   *
   * @param layerName the name of the layer to retrieve
   * @returns an object with each module and its version (eg `{"axios": "0.27.0"}`)
   */
  async fetchModulesForLayer(layerName: string) {
    const layerRefName = `${layerName.replace(/^./, x => x.toUpperCase())}LambdaLayer`;

    const dependencies = await getExternalModules(this.serverless, this.config, layerRefName);
    if (dependencies.length === 0) return {};
    const folderPath = this.config.packageJsonPath?.trim()?.replace(/\/?package.json/, '') ?? basePath;
    const packageJsonPath = path.join(folderPath, 'package.json');
    const packageJsonText = await fs.promises.readFile(packageJsonPath, { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageJsonText) as PackageJsonFile;
    const depsWithVersion = dependencies.reduce(
      (obj, dep) => ({
        ...obj,
        [dep]: packageJson.dependencies?.[dep] ?? packageJson.devDependencies?.[dep] ?? '*',
      }),
      {} as Record<string, string>
    );
    const deps: Record<string, string> = {};
    for (const [name, version] of Object.entries(depsWithVersion)) {
      if (!version) {
        this.log.verbose(`Skipping ${name} as it is not defined in the package.json folder`);
        continue;
      }
      deps[name] = version;
      try {
        const depPackageJsonText = await fs.promises.readFile(
          path.join(folderPath, 'node_modules', ...name.split('/'), 'package.json'),
          {
            encoding: 'utf-8',
          }
        );
        const depPackageJson = JSON.parse(depPackageJsonText) as PackageJsonFile;
        const { peerDependencies, peerDependenciesMeta } = depPackageJson;
        for (const [peerDepName] of Object.entries(peerDependencies ?? {})) {
          try {
            const optional = peerDependenciesMeta?.[peerDepName]?.optional ?? false;
            if (optional) {
              this.log.verbose(`Skipping peer dep ${peerDepName} of package ${name} as it is optional`);
              continue;
            }

            if (deps[peerDepName]) {
              this.log.verbose(
                `Skipping peer dep ${peerDepName} of package ${name} as it is already added at the root level`
              );
              continue;
            }
            const peerPackageJsonText = await fs.promises.readFile(
              path.join(folderPath, 'node_modules', ...peerDepName.split('/'), 'package.json'),
              {
                encoding: 'utf-8',
              }
            );
            const peerPackageJson = JSON.parse(peerPackageJsonText) as PackageJsonFile;
            if (!peerPackageJson.version) {
              throw new Error(`Submodule ${peerDepName} is missing version in its package.json file`);
            }
            deps[peerDepName] = peerPackageJson.version;
          } catch (err) {
            this.log.warning(`Unable to add peer dep ${peerDepName} for package ${name} as an error occurred`);
            this.log.verbose(err);
          }
        }
      } catch (err) {
        this.log.warning(`Unable to check for peer deps for package ${name} as an error occurred`);
        this.log.verbose(err);
      }
    }
    return deps;
  }

  /**
   * function to install a particular layer
   * @param layer the layer object
   * @param layerName the name of the object
   * @returns a boolean to indicate whether it was installed
   */
  async installLayer(layer: Layer, layerName: string): Promise<boolean> {
    try {
      const { path: localPath } = layer;
      const nodeLayerPath = `${localPath}/nodejs`;
      const packageJsonPath = path.join(nodeLayerPath, 'package.json');
      if (!fs.existsSync(nodeLayerPath)) {
        await fs.promises.mkdir(nodeLayerPath, { recursive: true });
      }
      const dependencies = await this.fetchModulesForLayer(layerName);
      if (Object.keys(dependencies).length === 0) return false;
      const fileName = PACKAGER_LOCK_FILE_NAMES[this.packager];
      try {
        await fs.promises.copyFile(path.join(process.cwd(), fileName), path.join(nodeLayerPath, fileName));

        const packageJsonExists = fs.existsSync(packageJsonPath);
        if (this.config.preservePackageJson && packageJsonExists) {
          this.log.info(`Preserving existing package.json at ${packageJsonPath}`);
        } else {
          const folderPath = this.config.packageJsonPath?.trim()?.replace(/\/?package.json/, '') ?? basePath;
          const packageJsonText = await fs.promises.readFile(path.join(folderPath, 'package.json'), {
            encoding: 'utf-8',
          });
          const packageJson = JSON.parse(packageJsonText) as PackageJsonFile;
          await fs.promises.writeFile(
            packageJsonPath,
            JSON.stringify(
              {
                dependencies,
                resolutions: packageJson.resolutions ?? {},
              },
              null,
              2
            )
          );
        }
      } catch {
        this.log.info(`Unable to copy ${fileName} across, this will cause version inaccuracies`);
      }

      const productionModeFlagEnvironmentAgnostic =
        process.platform === 'win32' ? 'set NODE_ENV=production &&' : 'NODE_ENV=production';
      const productionModeFlag = productionModeFlagEnvironmentAgnostic;
      const packageJsonExists = fs.existsSync(packageJsonPath);
      const shouldPreservePackageJson = this.config.preservePackageJson && packageJsonExists;

      let command: string;
      if (shouldPreservePackageJson) {
        command = `${productionModeFlag} ${PACKAGER_INSTALL_COMMAND[this.packager]}`;
      } else {
        command = `${productionModeFlag} ${PACKAGER_ADD_COMMAND[this.packager]} ${Object.entries(dependencies)
          .map(([name, version]) => `${name}@${version}`)
          .join(' ')}`;
      }

      this.log.info(`Layer = ${layerName}`);
      this.log.info(`Running command ${command}`);
      await exec(command, {
        cwd: nodeLayerPath,
        encoding: null,
      });
      if (this.packager === 'yarn') {
        await exec(`yarn autoclean --init`, { cwd: nodeLayerPath, encoding: null });
      }
      return true;
    } catch (err) {
      this.log.error(err);
      return false;
    }
  }

  /**
   * cleanup a layer after installation
   *
   * this involves two actions:
   *
   *  1. cleaning:
   *      this will identify anything in your `exclude` settings inside the serverless config
   *  2. minification:
   *      this will minify the JS files inside your node modules to reduce the overall size of the code in the node modules
   *
   * @param folder the folder to clean
   */
  async cleanup(folder: string): Promise<void> {
    const { clean, minify } = this.config;
    if (!clean) return;
    const nodeLayerPath = `${folder}/nodejs`;
    const exclude: string[] =
      this.serverless.service?.package?.exclude ??
      this.serverless.service?.package?.patterns
        ?.filter((p: string) => p.startsWith('!'))
        .map((p: string) => p.replace(/^!/, '')) ??
      [];
    this.log.info(`Cleaning ${exclude.map(rule => path.join(nodeLayerPath, rule)).join(', ')}`);
    let filesDeleted: string[] = [];
    try {
      filesDeleted = await del(exclude.map(rule => path.join(nodeLayerPath, rule)));
    } catch (_err) {}
    if (fs.existsSync(nodeLayerPath) && minify) {
      await minifyAll(nodeLayerPath, {
        compress_json: true,
        module: true,
        mangle: true,
        packagejson: true,
      });
    }
    this.log.info(`Cleaned ${filesDeleted.length} files at ${nodeLayerPath}`);
  }

  /**
   * function to transform the layer resources for cloudformation
   * @returns the transformed layer resources
   */
  transformLayerResources(): TransformedLayerResources {
    const layers = getLayers(this.serverless);
    const { compiledCloudFormationTemplate: cf } = this.serverless.service.provider;

    const layersKeys = Object.entries(layers).filter(([name]) => this.installedLayerNames.has(name));

    const transformedResources = layersKeys.reduce(
      (result: Maybe<TransformedLayerResources>, [id, layer]) => {
        if (!result) {
          result = {
            exportedLayers: [],
            upgradedLayerReferences: [],
          };
        }
        const name = pascalcase(id);
        const exportName = `${name}LambdaLayerQualifiedArn`;
        const output: Maybe<Output> = (cf.Outputs ?? {})[exportName];

        if (!output) {
          return result;
        }
        if (layer.retain === false || layer.retain === undefined) return result;

        output.Export = {
          Name: {
            'Fn::Sub': exportName,
          },
        };
        result.exportedLayers.push(output);

        const resourceRef = `${name}LambdaLayer`;
        const versionedResourceRef = output.Value.Ref;

        if (resourceRef !== versionedResourceRef) {
          this.log.info(`Replacing references to ${resourceRef} with ${versionedResourceRef}`);
          const resources = cf.Resources as { [key: string]: CloudFormationResource };
          for (const resource of Object.entries(resources)) {
            const [id, { Type: type, Properties = {} }] = resource;
            const {
              Layers: layers = [],
            }: Partial<CloudFormationResource['Properties'] & { Layers: FunctionLayerReference[] }> = Properties;
            if (type === 'AWS::Lambda::Function') {
              for (const layer of layers) {
                if (layer.Ref === resourceRef) {
                  this.log.verbose(`${id}: Updating reference to layer version ${versionedResourceRef}`);
                  layer.Ref = versionedResourceRef;
                  result.upgradedLayerReferences.push(layer);
                }
              }
            }
          }
        }

        return result;
      },
      {
        exportedLayers: [],
        upgradedLayerReferences: [],
      }
    );
    return (
      transformedResources ?? {
        exportedLayers: [],
        upgradedLayerReferences: [],
      }
    );
  }
}

export default EsbuildLayersPlugin;
