const path = require('path');
const Koa = require('koa');
const views = require('koa-views');
const utils = require('./common/utils');
const history = require('connect-history-api-fallback');

let env;
try {
  const services = require('./common/services').getServices();
  env = services.DEPLOYMENT_ENV;
} catch (error) {
  console.info(`Error while fetching UPS - "${error.message}" - Using process.env instead`);
  env = process.env.DEPLOYMENT_ENV;
}

const external = new Koa();

const meta = utils.isProductionEnvironment(env) ? '' : '<meta name="env" content="development">';

external.use(
  views(path.resolve('./dist/admin'), {
    extension: 'html',
    map: {
      html: 'lodash',
    },
  })
);

external.use(async ctx =>
  ctx.render('index', {
    meta,
  })
);

external.use(
  history({
    index: '/admin',
    verbose: false,
  }),
);

module.exports = external;
