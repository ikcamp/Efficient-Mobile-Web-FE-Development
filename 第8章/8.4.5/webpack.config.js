var webpack = require('webpack');

module.exports = {
  entry: __dirname + "/app/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    chunkFilename: "[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: [
            'es2015'
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