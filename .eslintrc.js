module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['jest'],
  env: {
    es6: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
      },
    },
    {
      files: ['module_test/**/*'],
      rules: {
        'import/no-unresolved': 0,
      },
    },
    {
      files: ['src/**/*.ts', 'src/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/await-thenable': 1,
        '@typescript-eslint/prefer-nullish-coalescing': 1,
        '@typescript-eslint/prefer-includes': 1,
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-unnecessary-type-constraint': 0,
      },
    },
  ],
};
