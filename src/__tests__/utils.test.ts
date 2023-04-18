import Serverless from 'serverless';
import { notEmpty, isFunctionDefinition, fixModuleName, findEntriesSpecified, globPromise } from '../utils';

describe('notEmpty', () => {
  it('should false for null', () => {
    expect(notEmpty(null)).toEqual(false);
  });
  it('should false for undefined', () => {
    expect(notEmpty(undefined)).toEqual(false);
  });
  it('should true for number', () => {
    expect(notEmpty(Math.random())).toEqual(true);
  });
});

describe('isFunctionDefinition', () => {
  it('should return false if null', () => {
    expect(isFunctionDefinition(null as unknown as Serverless.FunctionDefinitionHandler)).toEqual(false);
  });
  it('should return false if undefined', () => {
    expect(isFunctionDefinition(undefined as unknown as Serverless.FunctionDefinitionHandler)).toEqual(false);
  });
  it('should return true if including a handler property', () => {
    expect(isFunctionDefinition({ handler: '' } as unknown as Serverless.FunctionDefinitionHandler)).toEqual(true);
  });
});

describe('fixModuleName', () => {
  const modules = {
    '@beforeyoubid/ui-lib': '@beforeyoubid/ui-lib',
    '@beforeyoubid/ui-lib/something': '@beforeyoubid/ui-lib',
    'uuid/v4': 'uuid',
  };
  for (const [lib, expectedLib] of Object.entries(modules)) {
    it(`${lib} should output as ${expectedLib}`, () => {
      expect(fixModuleName(lib)).toEqual(expectedLib);
    });
  }
});

describe('globPromise', () => {
  it('will match .default', async () => {
    const res = await globPromise('examples/example-layer-service/hello.default');
    expect(res).toEqual(['examples/example-layer-service/hello.js']);
  });
  it('will match an export key', async () => {
    const res = await globPromise('examples/example-layer-service/hello.someExport');
    expect(res).toEqual(['examples/example-layer-service/hello.js']);
  });
  it('will match file type', async () => {
    const res = await globPromise('examples/example-layer-service/hello.js');
    expect(res).toEqual(['examples/example-layer-service/hello.js']);
  });
  describe('will match files with no folder', () => {
    it('will match .default', async () => {
      const res = await globPromise('.eslintrc.default');
      expect(res).toEqual(['.eslintrc.js']);
    });
    it('will match an export key', async () => {
      const res = await globPromise('.eslintrc.someExport');
      expect(res).toEqual(['.eslintrc.js']);
    });
    it('will match file type', async () => {
      const res = await globPromise('.eslintrc.default');
      expect(res).toEqual(['.eslintrc.js']);
    });
  });
});

describe('findEntriesSpecified', () => {
  it('if given a string it will handle it', async () => {
    const key = 'examples/example-layer-service/hello.default';
    const res = await findEntriesSpecified(key);
    expect(res).toEqual(['examples/example-layer-service/hello.js']);
  });
  it('if given an array it will handle it', async () => {
    const key = 'examples/example-layer-service/hello.default';
    const res = await findEntriesSpecified([key]);
    expect(res).toEqual(['examples/example-layer-service/hello.js']);
  });
  it('if given an empty array it will return nothing', async () => {
    const res = await findEntriesSpecified([]);
    expect(res).toEqual([]);
  });
  it('if given a bad variable it will return an empty array', async () => {
    const res = await findEntriesSpecified(123 as unknown as string);
    expect(res).toEqual([]);
  });
});
