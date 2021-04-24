const config = require('./config');

let externalProdConfig = config.generateCommonConfig({
  entryPointPath: './src/external-main.ts',
  templateIndexHtmlPath: './public/external-index.html',
  distPath: 'admin',
});

externalProdConfig = config.generateProdConfig({
  config: externalProdConfig,
  distPath: 'admin',
});

module.exports = externalProdConfig;
