import { log, error, warn, verbose, info, debug } from '../logger';

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'log').mockImplementation();
    jest.spyOn(global.console, 'warn').mockImplementation();
    jest.spyOn(global.console, 'error').mockImplementation();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('log', () => {
    it('should call console.log', () => {
      const code = Math.random().toString();
      log(code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
  });
  describe('error', () => {
    it('should call console.error', () => {
      const code = Math.random().toString();
      error(code);
      expect(console.error).toBeCalledTimes(1);
      expect(console.error).toBeCalledWith('[esbuild-layers]', code);
    });
  });
  describe('warn', () => {
    it('should call console.warn', () => {
      const code = Math.random().toString();
      warn(code);
      expect(console.warn).toBeCalledTimes(1);
      expect(console.warn).toBeCalledWith('[esbuild-layers]', code);
    });
  });
  describe('debug', () => {
    it('should call console.log if log level = debug', () => {
      const code = Math.random().toString();
      debug({ level: 'debug' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
    it('should not call console.log if log level != verbose', () => {
      const code = Math.random().toString();
      debug({ level: 'verbose' }, code);
      expect(console.log).toBeCalledTimes(0);
      expect(console.log).not.toBeCalledWith('[esbuild-layers]', code);
    });
    it('should not call console.log if log level != debug', () => {
      const code = Math.random().toString();
      debug({ level: 'info' }, code);
      expect(console.log).toBeCalledTimes(0);
      expect(console.log).not.toBeCalledWith('[esbuild-layers]', code);
    });
  });
  describe('verbose', () => {
    it('should call console.log if log level = debug', () => {
      const code = Math.random().toString();
      verbose({ level: 'debug' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
    it('should call console.log if log level = verbose', () => {
      const code = Math.random().toString();
      verbose({ level: 'verbose' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
    it('should not call console.log if log level != verbose', () => {
      const code = Math.random().toString();
      verbose({ level: 'info' }, code);
      expect(console.log).toBeCalledTimes(0);
      expect(console.log).not.toBeCalledWith('[esbuild-layers]', code);
    });
  });
  describe('info', () => {
    it('should call console.log if log level = verbose', () => {
      const code = Math.random().toString();
      info({ level: 'verbose' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
    it('should call console.log if log level = debug', () => {
      const code = Math.random().toString();
      info({ level: 'debug' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
    it('should call console.log if log level = info', () => {
      const code = Math.random().toString();
      info({ level: 'info' }, code);
      expect(console.log).toBeCalledTimes(1);
      expect(console.log).toBeCalledWith('[esbuild-layers]', code);
    });
  });
});
