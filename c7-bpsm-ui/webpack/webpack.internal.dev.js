const config = require('./config');
const path = require('path');

let internalDevConfig = config.generateCommonConfig({
  entryPointPath: './src/internal-main.ts',
  templateIndexHtmlPath: './public/internal-index.html',
  distPath: 'c7-bpsm',
});

internalDevConfig = config.generateDevConfig({
  config: internalDevConfig,
  distPath: 'c7-bpsm',
  beforeMiddleware: getInternalDevMiddleware(),
  port: 8086,
});

function getInternalDevMiddleware() {
  const dotEnvMiddleware = (req, res, next) => {
    require('dotenv').config({
      path: path.resolve('./.env'),
    });
    next();
  };

  const pheonixServiceBindingsMiddleware = require('@monsantoit/phoenix-service-bindings-middleware');
  const phoenixServiceBindingsRouter = pheonixServiceBindingsMiddleware({}, { localOcelot: true });

  return function internalMiddleware(app) {
    app.use(dotEnvMiddleware);
    app.use('/service-bindings', phoenixServiceBindingsRouter);
  };
}

module.exports = internalDevConfig;
