const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const pheonixServiceBindings = require('@monsantoit/phoenix-service-bindings-koa-middleware');
const utils = require('./common/utils');

let env;
try {
  const services = require('./common/services').getServices();
  env = services.DEPLOYMENT_ENV;
} catch (error) {
  console.info(`Error while fetching UPS - "${error.message}" - Using process.env instead`);
  env = process.env.DEPLOYMENT_ENV;
}

const internal = new Koa();

const meta = utils.isProductionEnvironment(env) ? '' : '<meta name="env" content="development">';

const serviceBindingsMiddleware = pheonixServiceBindings(
  {},
  {
    localOcelot: !utils.isHosted(),
  }
);

internal.use(serviceBindingsMiddleware);

internal.use(
  views(path.resolve('./dist/c7-bpsm'), {
    extension: 'html',
    map: {
      html: 'lodash',
    },
  })
);

internal.use(async ctx =>
  ctx.render('index', {
    meta: `${meta}<script>${ctx.state.phoenix}</script>`,
  })
);

module.exports = internal;
