import { Level, LevelName } from './types';
import type Plugin from 'serverless/classes/Plugin';

/** function to log to console */
export function log(...s: unknown[]) {
  console.log('[esbuild-layers]', ...s);
}
/** function to error to console */
export function error(...s: unknown[]) {
  console.error('[esbuild-layers]', ...s);
}
/** function to warn to console */
export function warn(...s: unknown[]) {
  console.warn('[esbuild-layers]', ...s);
}

/** function to log a verbose message console */
export function verbose({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.verbose && log(...s);
}

/** function to log an info message console */
export function info({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.info && log(...s);
}

/** function to log a debug message console */
export function debug({ level }: { level: LevelName }, ...s: unknown[]) {
  Number(Level[level]) >= Level.debug && log(...s);
}

/** function to create a serverless compatible logger instance */
export const Log = (level: LevelName): Plugin.Logging['log'] => ({
  info: info.bind(level),
  debug: debug.bind(level),
  verbose: verbose.bind(level),
  error,
  warning: warn,
  notice: info,
  success: info,
});
