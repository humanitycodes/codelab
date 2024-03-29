const path = require('path')
const config = require('../config')
const packageConfig = require('../package.json')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.brandedIndexTemplate = function () {
  const brand = process.env.CODELAB_BRAND || 'msu'
  return 'templates/' + brand + '.html'
}

exports.cssLoaders = function (options) {
  options = options || {}

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = []

    // If extracting, move the CSS to its own file, otherwise load it inline
    if (options.extract) {
      loaders.push(MiniCssExtractPlugin.loader)
    } else {
      loaders.push('style-loader')
    }

    // Always use the CSS loader
    loaders.push({
      loader: 'css-loader',
      options: {
        sourceMap: options.sourceMap
      }
    })

    // Use PostCSS if configured
    if (options.usePostCSS) {
      loaders.push({
        loader: 'postcss-loader',
        options: {
          sourceMap: options.sourceMap
        }
      })
    }

    // Add more specific loader (if available) last
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    return loaders
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass', {
      sassOptions: {
        functions: require('./loader-functions')
      }
    }),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
