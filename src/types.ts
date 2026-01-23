import type Serverless from 'serverless';
import type { Output } from 'serverless/aws';

export type Maybe<T> = null | undefined | T;

export type Layer = {
  path: string;
  name: string;
  description?: string;
  retain?: boolean;
};
export type PackageJsonFile = {
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  resolutions?: Record<string, string>;
  peerDependenciesMeta?: Record<
    string,
    {
      optional?: boolean;
    }
  >;
};
export type FunctionLayerReference = {
  Ref: string;
};
export type FunctionWithConfig = Serverless.FunctionDefinitionHandler & {
  layers?: FunctionLayerReference[];
  entry: string | string[];
  shouldLayer?: boolean;
  forceInclude?: string[];
  forceExclude?: string[];
};

export type TransformedLayerResources = { exportedLayers: Output[]; upgradedLayerReferences: FunctionLayerReference[] };
export type Packager = 'npm' | 'yarn' | 'pnpm';

export type Config = {
  packager: Packager | 'auto';
  level: LevelName;
  clean: boolean;
  minify: boolean;
  forceExclude: string[];
  forceInclude: string[];
  packageJsonPath?: string;
  preservePackageJson?: boolean;
};

export enum Level {
  none = 0,
  info = 1,
  verbose = 2,
  debug = 3,
}

export type LevelName = keyof typeof Level;
