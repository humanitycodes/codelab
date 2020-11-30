const path = require('path')

const env = process.env.NODE_ENV || ''
const isProduction = env === 'production'
const isStaging = env === 'staging'
const isTesting = env === 'testing'

const buildEnvFile = (isProduction || isStaging)
  ? `./${env}.env`
  : './test.env'

const buildIndexFile = isTesting
  ? 'index.html'
  : path.resolve(__dirname, '../dist/index.html')

module.exports = {
  dev: {
    env: require('./dev.env'),

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://localhost:4000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/auth': {
        target: 'http://localhost:4000/auth',
        changeOrigin: true,
        pathRewrite: {
          '^/auth': ''
        }
      }
    },

    // Various Dev Server Settings
    host: 'localhost',
    port: 8080,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    cssSourceMap: true
  },

  build: {
    env: require(buildEnvFile),

    // Template for index.html
    index: buildIndexFile,

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map'
  }
}
