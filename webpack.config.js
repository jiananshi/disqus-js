'use strict';

const webpack = require('webpack');
const path = require('path');
const PATH_DIST = path.resolve(__dirname, './dist');

module.exports = {
  devServer: {
    contentBase: 'dev-build',
    compress: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    hot: true,
    hotOnly: true,
    historyApiFallback: {
      disableDotRule: true
    },
    overlay: true
  },
  entry: {
    app: [
      './src/index'
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.css']
  },
  output: {
    path: PATH_DIST,
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: [
            require('postcss-cssnext')(),
            require('postcss-nested')()
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  plugins: [
    new (require('html-webpack-plugin'))({ template: path.resolve(__dirname, './index.html') }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
