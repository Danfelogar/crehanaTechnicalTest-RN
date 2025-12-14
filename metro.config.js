const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const config = {
  resolver: {
    extraNodeModules: {
      assert: require.resolve('assert'),
      console: require.resolve('console-browserify'),
      util: require.resolve('util'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      events: require.resolve('events'),
    },
    blockList: [
      /\/__mocks__\/.*/,
      /.*\.test\.(js|jsx|ts|tsx)$/,
      /.*\.spec\.(js|jsx|ts|tsx)$/,
    ],
  },
  watchFolders: [path.resolve(__dirname)],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
