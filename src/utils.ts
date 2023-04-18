import type Serverless from 'serverless';
import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'glob';
import * as esbuild from 'esbuild';
import nodeExternalsPlugin from 'esbuild-node-externals';
import isBuiltinModule from 'is-builtin-module';

import type { Maybe, FunctionWithConfig, Layer, Config } from './types';
import { DEFAULT_CONFIG } from './constants';

import { exec as execNonPromise, ExecOptions, ExecException } from 'child_process';
import util from 'util';

/**
 * TypeScript typeguard to ensure the type is not null or undefined
 * @param value the type to check
 * @returns a boolean whether it was null/undefined or not
 */
export const notEmpty = <TValue>(value: Maybe<TValue>): value is TValue => value !== null && value !== undefined;

/**
 * a TypeScript typeguard to check whether a serverless function definition is a handler or an image
 * @param value the function to check
 * @returns a boolean whether the function was a handler or not
 */
export const isFunctionDefinition = (
  value: Serverless.FunctionDefinitionHandler | Serverless.FunctionDefinitionImage
): value is FunctionWithConfig => notEmpty(value) && Object.prototype.hasOwnProperty.call(value, 'handler');

/**
 * function to make glob run in a promise fashion
 * @param pattern the pattern to check
 * @returns a string list of all the file matches
 */
const globPromise = async (pattern: string): Promise<string[]> => {
  const paths = await glob(pattern.replace(/.default$/, '.@(ts|js)?(x)'), { withFileTypes: true });
  const basePath = pattern.includes('/') ? pattern.replace(/(.+)\/.+$/, (_full, match) => match) : '';
  return paths.map(p => path.join(basePath, p.name));
};

/**
 *
 * @param specifiedEntries
 * @returns
 */
async function findEntriesSpecified(specifiedEntries: string | string[]) {
  let entries = specifiedEntries;
  if (typeof specifiedEntries === 'string') {
    entries = [specifiedEntries];
  }
  if (!Array.isArray(entries)) {
    return [];
  }
  const allMapped = await Promise.all(entries.map(globPromise));
  return allMapped.reduce((arr, list) => arr.concat(list), []);
}

/**
 * resolve the entries of a particular layer
 * @param sls the serverless instance
 * @param layerRefName the layer ref name
 * @returns an object containing the entries
 */
export async function resolvedEntries(sls: Serverless, layerRefName: string) {
  const newEntries: Set<string> = new Set();
  const backupFileType = sls.service.custom?.['esbuild-layers']?.backupFileType ?? 'default';
  for (const func of Object.values(sls.service.functions)) {
    if (!isFunctionDefinition(func)) {
      console.error(`This library doesn't currently support functions with an image`);
      continue;
    }
    const { handler, layers = [], shouldLayer = true } = func;
    if (!shouldLayer) continue;
    if (!layers.some(layer => layer.Ref === layerRefName)) continue;
    const matchedSpecifiedEntries = await findEntriesSpecified([handler]);
    for (const entry of matchedSpecifiedEntries) {
      newEntries.add(path.resolve(entry));
    }
    if (matchedSpecifiedEntries.length === 0) {
      const match = handler.match(/^(((?:[^\/\n]+\/)+)?[^.]+(.jsx?|.tsx?)?)/);
      if (!match) continue;
      const [handlerName, , folderName = ''] = match;
      const files = await fs.promises.readdir(path.resolve(folderName.replace(/\/$/, '')));
      let fileName = handlerName.replace(folderName, '');
      const filteredFiles = files.filter(file => file.startsWith(fileName));
      if (filteredFiles.length > 1) {
        fileName += `.${backupFileType}`;
      } else {
        fileName = filteredFiles[0];
      }
      newEntries.add(path.resolve(path.join(folderName, fileName)));
    }
  }

  return Array.from(newEntries);
}

export const exec = util.promisify(
  (
    command: string,
    options: {
      encoding: 'buffer' | null;
    } & ExecOptions,
    callback: (error: ExecException | null, stdout: Buffer, stderr: Buffer) => void
  ) => execNonPromise(command, options, callback)
);

/**
 *
 * @param serverless
 * @returns
 */
export function getLayers(serverless: Serverless): { [key: string]: Layer } {
  return serverless.service.layers || {};
}

/**
 * locate all external modules attached to a particular layer
 * @param serverless the serverless instance to check
 * @param layerRefName the name of the layer to check
 * @returns an array of strings containing the layer's modules
 */
export async function getExternalModules(serverless: Serverless, layerRefName: string): Promise<string[]> {
  const entries = await resolvedEntries(serverless, layerRefName);
  if (entries.length === 0) return [];
  const result = await esbuild.build({
    entryPoints: entries,
    plugins: [nodeExternalsPlugin()],
    metafile: true,
    bundle: true,
    platform: 'node',
    logLevel: 'silent',
    outfile: '.serverless/tmp_build_file',
  });

  const importedModules = Object.values(result.metafile.outputs).map(({ imports }) => imports.map(i => i.path));
  const requiredModules = Object.values(result.metafile.inputs).map(({ imports }) =>
    imports
      .filter(i => i.path.startsWith('node_modules'))
      .map(i => i.original)
      .filter(notEmpty)
  );

  const imports = new Set(
    [...importedModules, ...requiredModules]
      .reduce((list, listsOfMods) => list.concat(...listsOfMods), [])
      .filter(module => !isBuiltinModule(module))
  );
  return Array.from(imports);
}

export function compileConfig(userConfig: Partial<Config>): Config {
  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
  };
}
