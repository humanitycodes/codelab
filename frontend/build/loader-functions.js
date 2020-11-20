const lodash = require('lodash')
const brand = process.env.CODELAB_BRAND || 'msu'
const tw = require('../config/design/' + brand + '-tailwind')
const sass = require('sass')
const hexToRGB = require('../config/design/helpers/hex-to-rgb')

module.exports = {
  // Takes in tailwind key and returns the value in loader
  'get($keys)' : function (keys) {
    const keyArray = keys.getValue().split('.')
    const result = lodash.get(tw, keyArray)
    if (typeof result === 'string') {
      if (result.includes('#')) {
        const rgb = hexToRGB(result)
        if (rgb) {
          return new sass.types.Color(rgb[0], rgb[1], rgb[2])
        } else {
          return new sass.types.Null()
        }
      } else {
        return new sass.types.String(result)
      }
    } else {
      return new sass.types.Null()
    }
  }
}
