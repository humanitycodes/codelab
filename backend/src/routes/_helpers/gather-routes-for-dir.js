import glob from 'glob'
import path from 'path'

export default routeDir => {
  const cwd = path.join(__dirname, `../${routeDir}/**/*.js`)
  const routes = []

  glob.sync(cwd, {
    // Ignore files in directories that begin with _ (e.g. _helpers)
    ignore: '**/_*/**/*',
    nodir: true
  }).forEach(file => {
    const routeConfig = require(file).default
    if (Array.isArray(routeConfig)) {
      routeConfig.forEach(route => routes.push(route))
    } else {
      routes.push(routeConfig)
    }
  })

  return routes
}
