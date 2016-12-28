import glob from 'glob'
import path from 'path'

const cwd = path.join(__dirname, './api/**/*.js')
let routes = []

glob.sync(cwd).forEach(file => {
  routes.push(require(file).default)
})

export const config = routes
