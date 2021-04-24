const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { DefinePlugin } = require('webpack');
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const common = {
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            ts: 'babel-loader!ts-loader!tslint-loader',
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader' /* es6 to es5 with babel */,
          },
          {
            loader: 'ts-loader', // compiles ts to js
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
          {
            loader: 'tslint-loader',
            options: {
              failOnHint: false,
              configFile: 'tslint.json',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [],
        options: {
          presets: ['env', 'es2015'],
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'vue-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
};

const generateCommonConfig = ({
  entryPointPath = undefined,
  templateIndexHtmlPath = undefined,
  distPath = undefined,
}) => {

  if (!entryPointPath || !templateIndexHtmlPath || !distPath) {
    throw new Error('Please provide all parameter options in order to generate the webpack');
  }

  return merge(common, {
    entry: ['@babel/polyfill', entryPointPath],
    plugins: [
      new CleanWebpackPlugin([`dist/${distPath}`]),
      new DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
        'process.env.PUBLIC_PATH': `/${distPath}`,
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: templateIndexHtmlPath, // test if this is fine vs {external/internal}-index.html
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency',
      }),
    ],
  });
};

module.exports = generateCommonConfig;
