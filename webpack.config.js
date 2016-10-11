var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    app: './src/disqus-sdk.js'
  },

  output: {
    path: './dist',
    publicPath: '/',
    filename: '[name].js'
  },

  resolve: {
    root: [ path.resolve('./src') ]
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: [ 'babel-loader' ] },
      { test: /\.css$/, loaders: [ 'style-loader', 'css-loader', 'postcss-loader' ] },
      { test: /(html|mst)$/, exclude: /node_modules/, loaders: [ 'html-loader' ] }
    ]
  },

  postcss: function() {
    return [
      require('postcss-nested'),
      require('postcss-cssnext')({ browsers: ['iOS >= 7', 'Android >= 4.0', 'last 2 versions'] })
    ];
  },

  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({ minimize: false })
  ]
};

