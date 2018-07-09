const path = require('path');

module.exports = {
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    library: 'main',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:[  'stage-2', 'env' ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },
  devtool: 'inline-source-map',
  target: 'node',
  node: {
    fs: 'empty'
  },
  externals: {
    "aws-sdk": "aws-sdk"
  }
};
