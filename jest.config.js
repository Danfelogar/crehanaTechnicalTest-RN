module.exports = {
  testEnvironment: 'node',

  moduleDirectories: [
    'node_modules',
    '<rootDir>/__mocks__',
    '<rootDir>/src/shared/__mocks__',
    __dirname,
  ],

  setupFiles: ['<rootDir>/jest.setup.js'],

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: ['module:@react-native/babel-preset'],
      },
    ],
  },

  transformIgnorePatterns: [
    'node_modules/(?!.pnpm|react-native|@react-native|@react-navigation|@testing-library|zustand)',
  ],

  moduleNameMapper: {
    '^react-native-mmkv$':
      '<rootDir>/src/shared/__mocks__/store/react-native-mmkv.ts',
    '^@env$': '<rootDir>/src/shared/__mocks__/env.ts',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__mocks__/**',
    '!src/**/__tests__/**',
  ],
};
