// Turns a path (e.g. '../assets/some.png') into a CSS-style URL attribute
// (e.g. 'url(\'../assets/some.png\')')
module.exports = function (path) {
  return 'url(\'' + path + '\')'
}
