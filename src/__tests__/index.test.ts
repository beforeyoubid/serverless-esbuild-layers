import Serverless from 'serverless';
import LayerManagerPlugin from '..';
import { PACKAGER_ADD_COMMAND, DEFAULT_CONFIG } from '../constants';
import { Packager } from '../types';

import { exec } from '../utils';

function createSls(layerConfig = {}) {
  return {
    service: {
      provider: {
        compiledCloudFormationTemplate: {
          Resources: {
            FooLambdaLayer3ed25b0e140bd1e41c1e324ac4792fd38d3757af: {
              Type: 'AWS::Lambda::LayerVersion',
              Properties: {
                LayerName: 'Foo',
              },
              DeletionPolicy: 'Retain',
            },
            BarLambdaLayer9d80ae7472d5ab9ca001e6a13cdca0aba66c372f: {
              Type: 'AWS::Lambda::LayerVersion',
              Properties: {
                LayerName: 'Bar',
              },
              DeletionPolicy: 'Retain',
            },
            HelloLambdaFunction: {
              Type: 'AWS::Lambda::Function',
              Properties: {
                FunctionName: 'hello',
                Layers: [
                  {
                    Ref: 'FooLambdaLayer',
                  },
                ],
              },
            },
          },
          Outputs: {
            FooLambdaLayerQualifiedArn: {
              Value: {
                Ref: 'FooLambdaLayer3ed25b0e140bd1e41c1e324ac4792fd38d3757af',
              },
            },
            BarLambdaLayerQualifiedArn: {
              Value: {
                Ref: 'BarLambdaLayer9d80ae7472d5ab9ca001e6a13cdca0aba66c372f',
              },
            },
          },
        },
      },
      custom: {
        'esbuild-layers': layerConfig,
      },
      functions: {
        hello: {
          handler: 'examples/example-layer-service/hello.default',
          layers: [
            {
              Ref: 'FooLambdaLayer',
            },
          ],
        },
      },
      layers: {
        foo: {
          path: 'Foo',
        },
        bar: {
          path: 'Bar',
        },
      },
    },
  } as unknown as Serverless;
}

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  exec: jest.fn(),
}));

class Plugin extends LayerManagerPlugin {
  // Mock the install method
  async installLayer() {
    return await Promise.resolve(true);
  }
}

const DEFAULT_OPTIONS = {
  stage: 'test',
  region: 'us-west-2',
};

function createMockPlugin(sls: Serverless, options = DEFAULT_OPTIONS) {
  const plugin = new Plugin(sls, options);

  return plugin;
}

function createPlugin(sls: Serverless, options = DEFAULT_OPTIONS) {
  const plugin = new LayerManagerPlugin(sls, options);

  return plugin;
}

describe(`Plugin tests`, () => {
  it(`should create plugin with default config successfully`, () => {
    const plugin = createMockPlugin(createSls());

    expect(plugin.config).toEqual(DEFAULT_CONFIG);
  });

  it(`should create plugin with custom config successfully`, () => {
    const config = {
      packager: 'auto',
    };

    const plugin = createMockPlugin(createSls(config));

    expect(plugin.config).toEqual({
      ...DEFAULT_CONFIG,
      ...config,
    });
  });

  it('should set log level using -v or --verbose flag', () => {
    expect(createMockPlugin(createSls()).level).not.toBe('verbose');
  });

  it(`should install layers successfully`, async () => {
    const sls = createSls({ manageNodeFolder: true });
    const plugin = createMockPlugin(sls);

    const { installedLayers } = await plugin.installLayers();
    expect(installedLayers).toHaveLength(2);
  });

  it(`should export layers successfully`, () => {
    const sls = createSls({
      exportLayers: true,
      upgradeLayerReferences: false,
    });
    const plugin = createMockPlugin(sls);

    const { exportedLayers, upgradedLayerReferences } = plugin.transformLayerResources();
    expect(exportedLayers).toHaveLength(2);
    expect(upgradedLayerReferences).toHaveLength(0);
  });

  it(`should upgrade versioned layer references successfully`, () => {
    const sls = createSls({
      exportLayers: false,
      upgradeLayerReferences: true,
    });
    const plugin = createMockPlugin(sls);

    const { exportedLayers, upgradedLayerReferences } = plugin.transformLayerResources();
    expect(exportedLayers).toHaveLength(0);
    expect(upgradedLayerReferences).toHaveLength(1);
  });
});

describe.only('plugin install', () => {
  const packagers: Packager[] = ['npm', 'yarn', 'pnpm'];
  for (const packager of packagers) {
    it(`should install layers successfully - ${packager}`, async () => {
      const sls = createSls({
        packager,
      });
      const plugin = createPlugin(sls);
      const { installedLayers } = await plugin.installLayers();
      expect(installedLayers).toHaveLength(1);
      expect(exec).toHaveBeenCalledWith(`NODE_ENV=production ${PACKAGER_ADD_COMMAND[packager]} lodash@*`, {
        cwd: 'Foo/nodejs',
        encoding: null,
      });
    });
  }
});
