exports.command = function (key, value, callback) {
  return this.execute(
    `window.localStorage.setItem('${key}', '${value}')`,
    [], callback
  )
}
