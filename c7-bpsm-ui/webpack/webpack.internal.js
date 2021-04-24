const config = require('./config');

let internalProdConfig = config.generateCommonConfig({
  entryPointPath: './src/internal-main.ts',
  templateIndexHtmlPath: './public/internal-index.html',
  distPath: 'c7-bpsm',
});

internalProdConfig = config.generateProdConfig({
  config: internalProdConfig,
  distPath: 'c7-bpsm',
});

module.exports = internalProdConfig;
