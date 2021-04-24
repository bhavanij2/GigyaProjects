const config = require('./config');

let externalDevConfig = config.generateCommonConfig({
  entryPointPath: './src/external-main.ts',
  templateIndexHtmlPath: './public/external-index.html',
  distPath: 'external-admin',
});

externalDevConfig = config.generateDevConfig({
  config: externalDevConfig,
  distPath: 'external-admin',
  beforeMiddleware: function(app) {},
  port: 8085,
});

module.exports = externalDevConfig;
