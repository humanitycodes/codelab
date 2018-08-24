const tailwindConfigFile = require('./config/design/helpers/tailwind-config-file')

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss')('./config/design/' + tailwindConfigFile),
    require('autoprefixer')()
  ]
}
