const path = require('path')
const utils = require('./utils')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    'app': './src/main.js',
    'service-worker': './src/service-worker.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isProduction
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@api': resolve('src/api'),
      '@assets': resolve('src/assets'),
      '@components': resolve('src/components'),
      '@config': resolve('config'),
      '@constants': resolve('src/constants'),
      '@env': resolve('src/env'),
      '@helpers': resolve('src/helpers'),
      '@layouts': resolve('src/layouts'),
      '@notifications': resolve('src/notifications'),
      '@pages': resolve('src/pages'),
      '@plugins': resolve('src/plugins'),
      '@src': resolve('src'),
      '@state': resolve('src/state')
    }
  },
  performance: {
    assetFilter (filename) {
      return [
        // Exclude files in the /audio directory from the performance report
        filename.includes('/audio/'),
        // Exclude source maps
        filename.endsWith('.map')
      ].every(result => !result)
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'vue'],
      formatter: require('eslint-friendly-formatter')
    })
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.m?js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('config'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
