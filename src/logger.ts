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

/** function to build a specific levelled-logger */
const buildLogger =
  (targetLevel: Level) =>
  ({ level }: { level: LevelName }, ...s: unknown[]) =>
    Number(Level[level]) >= targetLevel && log(...s);

/** function to log a verbose message console */
export const verbose = buildLogger(Level.verbose);
/** function to log an info message console */
export const info = buildLogger(Level.info);
/** function to log a debug message console */
export const debug = buildLogger(Level.debug);

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
