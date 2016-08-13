var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var outputFilename = '[name].js';

var plugins = [
  new webpack.ProvidePlugin({
    'Promise': 'imports?this=>global!exports?global.Promise!es6-promise', 
    'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
  })
];

if (process.env.COMPRESS) {
  plugins.push(
    new ExtractTextPlugin('[name].[contenthash:6].css'),
    new webpack.optimize.OccurenceOrderPlugin()
  );

  outputFilename = '[name].[chunkhash:6].js';
} else {
  plugins.push(
    new ExtractTextPlugin('[name].css')
  );
}

module.exports = {
  entry: {
    app: './app/disqus-sdk.js'
  },

  output: {
    path: './dist',
    publicPath: '/',
    filename: outputFilename
  },

  resolve: {
    root: [ path.resolve('./app') ],
    extensions: [ '', '.vue', '.js' ]
  },

  module: {
    loaders: [
      { test: /\.vue$/, exclude: /node_modules/, loaders: [ 'vue' ] },
      { test: /\.js$/, exclude: /node_modules/, loaders: [ 'babel-loader', 'eslint-loader' ] },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
      { test: /\.(gif|png|jpg|svg|ttf|woff2|woff|eot)$/, loader: 'url?limit=1000&name=[path][name].[hash:6].[ext]' }
    ]
  },

  postcss: function() {
    return [
      require('postcss-nested'),
      require('postcss-opacity'),
      require('postcss-cssnext')({ browsers: ['iOS >= 7', 'Android >= 4.0', 'last 2 versions'] })
    ];
  },

  babel: {
    presets: [ 'es2015' ],       
    plugins: [ 'transform-runtime' ]
  },

  eslint: {
    failOnWarning: true
  },

  plugins: plugins
};
