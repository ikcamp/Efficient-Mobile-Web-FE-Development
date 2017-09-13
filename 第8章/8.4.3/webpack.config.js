var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + "/app/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle-[chunkhash].js"
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
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css')
      }
    ]
  },
  plugins: [
        new WebpackMd5Hash(),
        new ExtractTextPlugin("bundle-[contenthash].css"),
        new HtmlWebpackPlugin({
          template: 'app/index.html'
        })
  ],
  devServer: {
    contentBase: "./public",
    inline: true
  }
}