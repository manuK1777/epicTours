import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        fetch: true,
        // ES2021 globals
        Promise: true,
        Map: true,
        Set: true,
        WeakMap: true,
        WeakSet: true,
        BigInt: true,
        // Node.js globals
        process: true,
        __dirname: true,
        __filename: true,
        require: true,
        module: true,
        exports: true,
        Buffer: true,
        global: true,
      },
    },
  },
];
