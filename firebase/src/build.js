import path from 'path'
import fs from 'fs'
import mapAndMerge from './utils/map-and-merge'
import { hasRole } from './generators/conditions'
import generatePermissions from './generators/permissions'
import generateUsers from './generators/users'
import generateRoles from './generators/roles'
import generateTopLevelResource from './generators/top-level-resource'
import usersDef from './defs/users'
import rolesDef from './defs/roles'
import resourcesDef from './defs/resources'
import { js_beautify as JSONBeautify } from 'js-beautify'

const resourceNames = Object.keys(resourcesDef)

const rules = {
  rules: {
    ...generatePermissions({
      read: hasRole('instructor')
    }),
    ...generateUsers(usersDef),
    ...generateRoles(rolesDef),
    ...mapAndMerge(resourceNames, name => {
      return generateTopLevelResource(name, resourcesDef[name])
    })
  }
}

fs.writeFile(
  path.join(__dirname, '../dist/firebase.rules.json'),
  JSONBeautify(
    JSON.stringify(rules),
    { indent_size: 2 }
  ),
  error => {
    if (error) throw error
    console.log('It\'s saved!')
  }
)
