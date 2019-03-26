const path = require('path')

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.tag$/,
        exclude: /(node_modules|bower_components)/,
        use: 'riot-tag-new-loader'
      }
    ]
  }
}