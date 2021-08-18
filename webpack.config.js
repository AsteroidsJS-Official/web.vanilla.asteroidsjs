const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: './src/index.js',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        resolve: {
          modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'AsteroidsJS',
      filename: 'assets/index.html',
      template: path.resolve(__dirname, './src/assets/html/index.html'),
    }),
    new webpack.ProgressPlugin(),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['nodemon dist/index.js --watch "./dist/index.js"'],
        blocking: false,
        parallel: true,
      },
    }),
  ],
  watch: true,
}
