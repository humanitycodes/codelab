const brand = process.env.CODELAB_BRAND || 'msu'
const tw = require('../config/design/'+ brand + '-tailwind')
const sass = require('node-sass')
const hexToRGB = require('../config/design/helpers/hex-to-rgb')

module.exports = {
    // Takes in tailwind key and returns the value in loader
    "get($keys)": function(keys) {
        keys = keys.getValue().split(".")
        let result = tw
        for (let i = 0; i < keys.length; i++) {
          result = result[keys[i]];
        }
        if (typeof result === 'string') {
          if (result.includes('#')){
            var rgb = hexToRGB(result)
            if (rgb) {
              var output = new sass.types.Color(rgb[0], rgb[1], rgb[2])
              return output
            } else {
              var output = new sass.types.Null()
              return output
            }
          } else {
            var output = new sass.types.String(result)
            return output
          }
        } else {
          var output = new sass.types.Null()
          return output
        }
    }
}