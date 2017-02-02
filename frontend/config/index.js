// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

let buildEnvFile = './prod.env'
let buildIndexFile = path.resolve(__dirname, '../dist/index.html')

if (process.env.NODE_ENV === 'staging') {
  buildEnvFile = './staging.env'
} else if (process.env.NODE_ENV === 'testing') {
  buildEnvFile = './test.env'
  buildIndexFile = 'index.html'
}

module.exports = {
  build: {
    env: require(buildEnvFile),
    index: buildIndexFile,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8181,
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
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true
  }
}
