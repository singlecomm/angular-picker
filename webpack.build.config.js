'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var MIN = process.argv.indexOf('-p') > -1;

module.exports = {
  entry: __dirname + '/src/module.js',
  devtool: MIN ? 'sourcemap' : null,
  externals: {
    angular: 'angular',
    'angular-sanitize': 'angular'
  },
  output: {
    path: __dirname + '/dist',
    filename: MIN ? 'angular-picker.min.js' : 'angular-picker.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['ng-annotate', 'babel', 'eslint'],
      exclude: /node_modules/
    }, {
      test: /\.css/,
      loader: ExtractTextPlugin.extract('style-loader', 'css')
    }, {
      test: /\.(png|gif)$/,
      loader: 'url-loader?limit=8192'
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin(MIN ? 'angular-picker.min.css' : 'angular-picker.css')
  ]
};
