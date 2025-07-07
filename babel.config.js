module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('nativewind/babel'), // ✅ Resolved plugin path
      'react-native-reanimated/plugin',     // ✅ Correct as string
    ],
  };
};
