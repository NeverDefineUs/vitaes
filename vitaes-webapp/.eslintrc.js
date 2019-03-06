module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'react/destructuring-assignment': 'off',
    'react/prop-types': 'off',
    'no-alert': 'off',
    'react/no-multi-comp': 'off',
    // this one is intended to be kept:
    'react/prefer-stateless-function': 'off'
  },
};
