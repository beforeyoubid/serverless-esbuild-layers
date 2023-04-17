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
  const paths = await glob(pattern, { withFileTypes: true });
  console.log({ paths });
  return [];
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
  const newEntries: Record<string, string> = {};
  const backupFileType =
    sls.service.custom.layerConfig.backupFileType ?? sls.service.custom.layerConfig.webpack.backupFileType ?? 'default';
  for (const func of Object.values(sls.service.functions)) {
    if (!isFunctionDefinition(func)) {
      console.error(`This library doesn't currently support functions with an image`);
      continue;
    }
    const { handler, layers = [], entry: specifiedEntries = [], shouldLayer = true } = func;
    if (!shouldLayer) continue;
    if (!layers.some(layer => layer.Ref === layerRefName)) continue;
    const matchedSpecifiedEntries = await findEntriesSpecified(specifiedEntries);
    for (const entry of matchedSpecifiedEntries) {
      newEntries[entry] = path.resolve(entry);
    }
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
    newEntries[handlerName] = path.resolve(path.join(folderName, fileName));
  }
  return newEntries;
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
  const result = await esbuild.build({
    entryPoints: [path.resolve(process.cwd(), 'src', 'handlers', 'graphql.ts')],
    plugins: [nodeExternalsPlugin()],
    metafile: true,
    bundle: true,
    platform: 'node',
    logLevel: 'silent',
    outfile: '.serverless/tmp_build_file',
  });
  const imports = new Set(
    Object.values(result.metafile.outputs)
      .map(({ imports }) => imports.map(i => i.path))
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