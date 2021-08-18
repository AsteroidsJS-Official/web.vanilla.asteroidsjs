const path = require('path')

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
  },
}
