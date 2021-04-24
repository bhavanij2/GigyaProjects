const merge = require('webpack-merge');
const common = require('./webpack.config');

const devConfig = {
  mode: 'development',
};

module.exports = merge(common, devConfig);
