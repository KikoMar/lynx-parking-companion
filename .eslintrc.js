module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },

  settings: {
    react: { version: 'detect' },
  },

  extends: [
    'react-app',
    'react-app/jest',
    'plugin:@typescript-eslint/recommended',
  ],

  plugins: ['@typescript-eslint'],

  rules: {
    // Let TypeScript's own compiler handle unused-vars; ESLint's rule
    // doesn't understand TS types/interfaces.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],

    // Explicit return types on every function are verbose in React; TS infers them fine.
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Empty arrow-functions are used in polyfills and test stubs.
    '@typescript-eslint/no-empty-function': 'off',

    // Non-null assertions are acceptable when the caller has already checked the value.
    '@typescript-eslint/no-non-null-assertion': 'off',
  },

  overrides: [
    {
      // Jest mock factories must use require(); allow it in all test files.
      files: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/test/**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
