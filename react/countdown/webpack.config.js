const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const convert = require('koa-connect');
const history = require('connect-history-api-fallback');

module.exports = (env = {}) => ({
  mode: env.production ? 'production' : 'development',

  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          env.production
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]---[hash:base64:5]'
            }
          },
          'postcss-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      title: 'Countdown',
      template: require('html-webpack-template'),
      appMountId: 'root',
      baseHref: '/',
      mobile: true,
      // for surge.sh in production
      filename: env.production ? '200.html' : 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],

  stats: 'minimal',

  serve: {
    dev: { logLevel: 'warn' },
    hot: { logLevel: 'warn' },

    add: (app, middleware, options) => {
      app.use(convert(history()));
    }
  }
});
