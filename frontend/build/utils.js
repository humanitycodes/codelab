var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var fs = require('fs')

exports.environmentFile = function () {
  const env = process.env.NODE_ENV || ''
  if (
    env.substr(-5) === '-prod' ||
    env.substr(-8) === '-staging'
  ) {
    return path.resolve(__dirname, `../src/env/${process.env.NODE_ENV}`)
  } else {
    try {
      // Try to use user-specific dev config
      const username = require('os').userInfo().username
      const userConfigFile = path.resolve(__dirname, `../src/env/dev-${username}.js`)
      fs.accessSync(userConfigFile, fs.F_OK)
      return userConfigFile
    } catch (e) {
      // Use default dev config
      return path.resolve(__dirname, '../src/env/dev')
    }
  }
}

exports.assetsPath = function (_path) {
  var assetsSubDirectory = (process.env.NODE_ENV || '').substr(-5) === '-prod'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}
