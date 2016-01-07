'use strict';

var webpack = require('webpack');
var WATCH = process.argv.indexOf('--watch') > -1;

var webpackConfig = {
  cache: true,
  devtool: 'inline-source-map',
  module: {
    preLoaders: [{
      test: /[^spec]\.js$/,
      loaders: ['eslint'],
      exclude: /node_modules/
    }, {
      test: /\.spec\.js$/,
      loaders: ['eslint?{configFile:"./.eslintrc.test"}'],
      exclude: /node_modules/
    }],
    loaders: [
      {
      test: /\.js/,
      loader: 'babel',
      exclude: /(node_modules|bower_components)/
    }, {
      test: /\.js/,
      loader: 'isparta',
      exclude: /(node_modules|spec|test)/
    }, {
      test: /\.css/,
      loaders: ['style', 'css']
    }, {
      test: /.(png|gif|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  plugins: [
  ]
};

if (!WATCH) {
  webpackConfig.plugins.push(new webpack.NoErrorsPlugin());
}

var browsers = ['PhantomJS'];
if (process.env.CI) {
  browsers = ['PhantomJS'];
}

module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'chai-things'],
    files: [
      'src/test.entry.js',
      '**/*.html'
    ],
    exclude: [
    ],
    preprocessors: {
      'src/test.entry.js': ['webpack', 'sourcemap'],
      '**/*.html': ['ng-html2js']
    },
    ngHtml2JsPreprocessor: {
    },
    coverageReporter: {
      reporters: [{
        type: 'text-summary'
      }, {
        type: 'html'
      }]
    },
    webpack: webpackConfig,
    reporters: ['progress', 'coverage'],
    port: 8987,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: WATCH,
    browsers: browsers,
    singleRun: !WATCH
  });
};
