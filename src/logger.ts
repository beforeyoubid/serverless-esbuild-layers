import { Level, LevelName } from './types';
import type Plugin from 'serverless/classes/Plugin';

export function log(...s: unknown[]) {
  console.log('[esbuild-layers]', ...s);
}
export function error(...s: unknown[]) {
  console.error('[esbuild-layers]', ...s);
}
export function warn(...s: unknown[]) {
  console.warn('[esbuild-layers]', ...s);
}

export function verbose({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.verbose && log(...s);
}

export function info({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.info && log(...s);
}

export function debug({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.debug && log(...s);
}

export const Log = (level: LevelName): Plugin.Logging['log'] => ({
  info: info.bind(level),
  debug: debug.bind(level),
  verbose: verbose.bind(level),
  error,
  warning: warn,
  notice: info,
  success: info,
});
