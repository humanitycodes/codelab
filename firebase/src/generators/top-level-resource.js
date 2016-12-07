import resourcesDef from '../defs/resources'
import mapAndMerge from '../utils/map-and-merge'
import fieldGroups from '../defs/field-groups'
import { userSignedIn } from './conditions'
import timestampFields from './timestamp-fields'
import generatePermissions from './permissions'
import generateFields from './fields'
import generateRelationships from './relationships'
import generateResource from './resource'

export default (name, def) => {
  const resourceKey = `$${name}Key`
  const resourceGroups = {
    meta: {
      [resourceKey]: {
        ...generatePermissions({
          read: userSignedIn
        }),
        ...generateFields(timestampFields)
      }
    },
    fieldGroups: {
      small: {},
      large: {}
    }
  }
  const generateFieldGroups = groups => {
    const groupNames = Object.keys(groups)
    return mapAndMerge(groupNames, groupName => {
      const groupDef = groups[groupName]
      const groupPermissions = {}
      groupPermissions.read = fieldGroups(name)[groupName]
      return generateResource(name, {
        validate: def.validate,
        matches: def.matches,
        permissions: groupPermissions,
        fields: groupDef
      }, groupName)
    })
  }
  if (def.fieldGroups) {
    if (def.fieldGroups.small) {
      resourceGroups.fieldGroups.small = generateFieldGroups(def.fieldGroups.small)
    }
    if (def.fieldGroups.large) {
      resourceGroups.fieldGroups.large = generateFieldGroups(def.fieldGroups.large)
    }
  }
  if (def.relationships) {
    resourceGroups.relationships = {
      [resourceKey]: {
        ...generatePermissions({ read: userSignedIn }),
        ...generateRelationships(name, def.relationships, resourcesDef)
      }
    }
  }
  return {
    [name]: {
      ...generatePermissions(def.permissions),
      ...resourceGroups
    }
  }
}
