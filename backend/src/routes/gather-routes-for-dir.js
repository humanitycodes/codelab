import glob from 'glob'
import path from 'path'

export default routeDir => {
  const cwd = path.join(__dirname, `./${routeDir}/**/*.js`)
  let routes = []

  glob.sync(cwd).forEach(file => {
    const routeConfig = require(file).default
    if (Array.isArray(routeConfig)) {
      routeConfig.forEach(route => routes.push(route))
    } else {
      routes.push(routeConfig)
    }
  })

  return routes
}
