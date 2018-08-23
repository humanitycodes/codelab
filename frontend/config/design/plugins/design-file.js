module.exports = function () {
  return function (style) {
    style.define('designFile', function () {
      return require('../helpers/brand-json')
    })
  }
}
