var path    = require('path');
var webpack = require('webpack');

/* Working Directory */
var src = path.join(__dirname, 'resources/assets/js/');

module.exports = {
  entry: {
    main: src + 'main.js'
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['','.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}
