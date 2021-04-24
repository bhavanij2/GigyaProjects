const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const webpackConfig = {
  entry: './src/server/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'server.js',
  },
  target: 'node',
  devtool: 'source-map',
  node: {
    __dirname: false,
    __filename: false,
  },
  plugins: [
    new CopyPlugin([
      { from: path.join(__dirname, 'src/server/generated/v1-swagger/swagger.json'), to: path.join(__dirname, 'dist/swagger.json') },
    ]),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};

module.exports = webpackConfig;
