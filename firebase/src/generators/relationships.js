import mapAndMerge from '../utils/map-and-merge'
import {
  any, all, keyInResource, noOtherFields
} from './conditions'
import timestampFields from './timestamp-fields'
import generateResource from './resource'

const generateRelationships = (parentResourceName, relationships) => {
  if (!relationships) return {}
  const relationshipNames = Object.keys(relationships)
  return mapAndMerge(relationshipNames, name => {
    const keyVar = `$${name}Key`
    const def = relationships[name]
    const resourceName = def.resource || name
    return {
      ...generateResource(name, {
        validate: all(
          any(
            keyInResource(keyVar, resourceName),
            keyInResource(keyVar, resourceName + '/meta')
          ),
          parentResourceName === resourceName &&
            `${keyVar} !== $${parentResourceName}Key`
        ),
        fields: {
          ...timestampFields,
          ...def.fields
        }
      }),
      ...generateRelationships(def.relationships),
      ...noOtherFields
    }
  })
}

export default generateRelationships
