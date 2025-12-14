module.exports = {
  root: true,
  extends: '@react-native',
  env: {
    jest: true,
    node: true,
  },
  overrides: [
    {
      files: [
        '**/__tests__/**/*',
        '**/__mocks__/**/*',
        '*.test.ts',
        '*.test.tsx',
        'jest.setup.js',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
