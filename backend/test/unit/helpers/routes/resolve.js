module.exports = (chai, utils) => {
  chai.Assertion.addMethod('resolve', function (method, path) {
    const routes = this._obj

    let foundRoute = routes.find(route => {
      return route.method === method && route.path === path
    })

    this.assert(
      !!foundRoute,
      `route ${method} ${path} should resolve`,
      `route ${method} ${path} should not resolve`
    )
  })
}
