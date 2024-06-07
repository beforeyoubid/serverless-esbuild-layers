import type Serverless from 'serverless';
import type { Output } from 'serverless/aws';

export type Runtime = `nodejs${number}.x`;

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
  peerDependenciesMeta?: Record<string, { optional?: boolean }>;
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
export type AWSSDKVersion = 2 | 3;

export type Auto = 'auto';

export type Config = {
  packager: Packager | Auto;
  level: LevelName;
  clean: boolean;
  minify: boolean;
  runtime?: Runtime;
  forceExclude: string[];
  forceInclude: string[];
  packageJsonPath?: Maybe<string>;
  awsSdkVersion: AWSSDKVersion | Auto;
};

export type ResolvedConfig = {
  [Key in keyof Config]-?: Exclude<Config[Key], Auto>;
};

export enum Level {
  none = 0,
  info = 1,
  verbose = 2,
  debug = 3,
}

export type LevelName = keyof typeof Level;
