var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var rm = require('rimraf')
var utils = require('./utils')

var isProduction = process.env.NODE_ENV === 'production'
var bundlePath = path.join(process.cwd(), './dist')
var htmlPath = process.cwd()

var entry = {
  index: './admin/index.js',
  vendor: ['vue']
}

module.exports = {
  entry: entry,
  output: {
    filename: '[name].bundle.js',
    path: bundlePath,
    publicPath: 'dist/'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    })
  ].concat(utils.generateTemplates(entry, htmlPath, isProduction)),
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: utils.getStyleLoaders(isProduction)
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 15000,
          name: 'img/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.styl'],
    modules: [path.join(process.cwd(), './admin'), 'node_modules'],
    alias: { 'vue$': 'vue/dist/vue.runtime.js' }
  },
  performance: { hints: false },
  devtool: '#eval-source-map',
  devServer: {
    contentBase: process.cwd(),
    compress: true,
    port: 9000,
    noInfo: true,
    proxy: {
      // '/api': { target: 'http://backend-address/' }
    }
  }
}

rm.sync(path.join(bundlePath, './*'))
if (isProduction) {
  module.exports.devtool = '#source-map'
  module.exports.output.filename = '[name].bundle.js'
  module.exports.plugins = module.exports.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: '"production"' }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: { warnings: false }
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true })
  ])
}
