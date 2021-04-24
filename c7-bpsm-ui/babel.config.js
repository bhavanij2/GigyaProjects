module.exports = (api) => {
  api.cache(true);

  const presets = [
    '@babel/env',
  ];
  const plugins = [
    // start stage-3 proposals
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', {'loose': false}],
    '@babel/plugin-proposal-json-strings',
    // end stage-3 proposals

    '@babel/transform-runtime',
  ];

  const testEnv = {
    presets: [
      '@babel/env',
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-modules-commonjs',
    ],
  };

  return {
    presets,
    plugins,
    env: {
      test: testEnv,
    },
  };
};
