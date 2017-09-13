var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: __dirname + "/app/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  devtool: "source-map",
  resolve: {
    root: [path.resolve("./lib")],
    modulesDirectories: [
      "web_modules", 
      "node_modules",
      "component"
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015',
            'react'
          ]
        }
      }
    ]
  },
  devServer: {
    contentBase: "./public",
    inline: true
  }
}