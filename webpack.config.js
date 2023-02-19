const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  // devtool: 'inline-source-map',
  entry: './src/renderer/index.tsx',

  resolve: {
    extensions: [
      '.js',
      '.tsx',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.css',
      '.scss',
    ],
  },
  // output: {
  //   path: path.join(__dirname, '/dist'),
  //   filename: 'bundle.js',
  // },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          // options: {
          //   presets: ['@babel/preset-env', '@babel/preset-react'],
          // },
        },
      },
      {
        test: /\.s?css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  devServer: {
    port: 8080,
    hot: true,
    host: 'localhost',
    historyApiFallback: true,
  },
};