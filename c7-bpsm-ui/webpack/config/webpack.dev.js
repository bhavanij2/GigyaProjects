const path = require('path');
const merge = require('webpack-merge');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');

const generateDevConfig = ({
  config = undefined,
  distPath = undefined,
  beforeMiddleware = undefined,
  port = undefined,
}) => {

  if (!config || !distPath || !port || !beforeMiddleware) {
    throw new Error('Please provide all parameter options in order to generate the webpack.');
  }

  return merge(config, {
    output: {
      filename: 'js/support-app.min.js',
      path: path.resolve(__dirname, `../../dist/${distPath}`),
      publicPath: '/',
    },
    mode: 'development',
    watch: true,
    devtool: 'inline-source-map',
    plugins: [
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '{{env}}',
          replacement: '<meta name="env" content="development">',
        },
        {
          pattern: '{{serviceBindings}}',
          replacement: '<script type="text/javascript" src="/service-bindings"></script>',
        }
      ]),
    ],
    devServer: {
      port,
      stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        moduleTrace: true,
        errorDetails: true,
        colors: true
      },
      historyApiFallback: {
        verbose: false,
        rewrites: [
          {from: /\/user-admin\/user\/.*/, to: '/index.html'} // avoid dot rule interference
        ]
      },
      before: beforeMiddleware,
      open: true,
      openPage: 'admin/home'
    },
  });
};

module.exports = generateDevConfig;
