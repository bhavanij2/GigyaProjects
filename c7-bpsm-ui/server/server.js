const path = require('path');
const utils = require('./common/utils');

if (!utils.isHosted()) {
  require('dotenv').config({
    path: path.resolve('./.env'),
  });
}

const port = utils.getPort();

const Koa = require('koa');
const Serve = require('koa-static');
const Mount = require('koa-mount');
const compress = require('koa-compress');
const helmet = require('koa-helmet');

const internal = require('./internal');
const external = require('./external');

if (!utils.isHosted()) {
  console.log('Local Ocelot support enabled on middleware');
}

const app = new Koa();

app.use(
  helmet({
    noCache: false,
  })
);

const noCache = helmet.noCache();

app.use(async (ctx, next) => {
  await next();
  if (ctx.response.type === 'text/html') {
    noCache(ctx);
  }
});

app.use(compress());

app.use(
  require('koa-add-trailing-slashes')({
    defer: true,
  })
);

app.use(Mount('/c7-bpsm/js', Serve('./dist/c7-bpsm/js')));
app.use(Mount('/admin/js', Serve('./dist/admin/js')));

app.use(Mount('/c7-bpsm', internal));
app.use(Mount('/', external));

const server = app.listen(port, () => {
  console.log(`Listening at http://${server.address().host || 'localhost'}:${port}`);
});
