const merge = require('webpack-merge');
const common = require('./webpack.config');

const prodConfig = {
  mode: 'production',
};

module.exports = merge(common, prodConfig);
