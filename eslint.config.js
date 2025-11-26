import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactPlugin from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],

    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    settings: {
      react: {
        version: 'detect', // <-- auto-detect React version
      },
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    rules: {
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,

      // custom rules
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/prop-types': 'off',
    },
  },
]);
