import { type Packager, type Config, Level } from './types';

export const PACKAGER_INSTALL_COMMAND: Record<Packager, string> = {
  npm: 'npm install',
  yarn: 'yarn install',
  pnpm: 'pnpm install',
};

export const PACKAGER_ADD_COMMAND: Record<Packager, string> = {
  npm: 'npm install',
  yarn: 'yarn add',
  pnpm: 'pnpm add',
};

export const PACKAGER_LOCK_FILE_NAMES: Record<Packager, string> = {
  npm: 'package-lock.json',
  yarn: 'yarn.lock',
  pnpm: 'pnpm-lock.yaml',
};

export const DEFAULT_CONFIG: Config = {
  packager: 'auto',
  level: Level.info,
  clean: true,
  minify: false,
};
