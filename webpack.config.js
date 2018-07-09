const webpack = require('webpack');
var webpackConfig = require('./webpack.config.common');

webpackConfig.entry = {
  'dist/lambda/handler': './src/lambda/handler.js'
};

module.exports = webpackConfig;
