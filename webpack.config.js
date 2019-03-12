const webpack = require("webpack");
const path = require("path");
var CompressionPlugin = require("compression-webpack-plugin");

const common = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [new CompressionPlugin()]
};

const client = {
  entry: "./client/src/index.jsx",
  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "bundle.js"
  }
};

const server = {
  entry: "./client/src/index.jsx",
  target: "node",
  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "bundle-server.js",
    libraryTarget: "commonjs-module"
  }
};

module.exports = [
  Object.assign({}, common, client),
  Object.assign({}, common, server)
];
