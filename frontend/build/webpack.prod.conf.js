'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: chunkData => {
      // The service worker filename must always be service-worker.js
      return chunkData.chunk.name === 'service-worker'
        ? '[name].js'
        : utils.assetsPath('js/[name].[chunkhash].js')
    },
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks (chunk) {
        // Optimize everything except the service-worker
        return chunk.name !== 'service-worker'
      },
      cacheGroups: {
        // Split vendor js into its own file
        vendor: {
          name: 'vendor',
          chunks (chunk) {
            return chunk.name === 'app'
          },
          test: /[\\/]node_modules[\\/]/
        },
        // extract webpack runtime and module manifest to its own file to
        // prevent vendor hash from being updated when app bundle is updated
        manifest: {
          name: 'manifest',
          chunks (chunk) {
            return chunk.name === 'app'
          },
          minChunks: Infinity
        },
        // If 3 or more chunks share a module, split and load it asynchronously
        'vendor-async': {
          name: 'vendor-async',
          chunks: 'async',
          minChunks: 3
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.build.env
    }),
    new LodashModuleReplacementPlugin(),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: utils.brandedIndexTemplate(),
      inject: true,
      excludeChunks: ['service-worker'],
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      }
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: config.build.assetsSubDirectory,
          globOptions: {
            dot: false
          }
        }
      ]
    })
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      )
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: '../reports/webpack-size-report.html',
    openAnalyzer: false
  }))
}

module.exports = webpackConfig
