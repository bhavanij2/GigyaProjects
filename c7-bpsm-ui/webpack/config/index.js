const dev = require('./webpack.dev');
const prod = require('./webpack.prod');
const common = require('./webpack.common');

module.exports = {
  generateCommonConfig: common,
  generateDevConfig: dev,
  generateProdConfig: prod,
};
