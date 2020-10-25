const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  externals: [nodeExternals()], //webpack will exclude everything in /node_modules
  entry: {
    server: ['./app.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './build'),
  },
};
