import glob from 'glob'
import path from 'path'

const cwd = path.join(__dirname, './api/**/*.js')
let routes = []

glob.sync(cwd).forEach(file => {
  const routeConfig = require(file).default
  if (Array.isArray(routeConfig)) {
    routeConfig.forEach(route => routes.push(route))
  } else {
    routes.push(routeConfig)
  }
})

export default routes
