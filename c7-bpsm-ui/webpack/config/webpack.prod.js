const path = require('path');
const merge = require('webpack-merge');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const generateProdConfig = ({
  config = undefined,
  distPath = undefined,
}) => {

  if (!config || !distPath) {
    throw new Error('Please provide all parameter options in order to generate the webpack.');
  }

  return merge(config, {
    output: {
      filename: 'js/support-app.min.js',
      path: path.resolve(__dirname, `../../dist/${distPath}`),
      publicPath: `/${distPath}`,
    },
    mode: 'production',
    plugins: [
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '{{env}}',
          replacement: '<%= meta %>',
        },
        {
          pattern: '{{serviceBindings}}',
          replacement: '',
        }
      ]),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          uglifyOptions: {
            mangle: true,
            compress: false,
          },
        }),
      ],
    },
  });
};

module.exports = generateProdConfig;
