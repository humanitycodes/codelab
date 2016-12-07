import mapAndMerge from '../utils/map-and-merge'
import {
  any, all, keyInResource, noOtherFields
} from './conditions'
import timestampFields from './timestamp-fields'
import generateResource from './resource'

const generateRelationships = (parentResourceName, relationships, resourcesDef) => {
  if (!relationships) return {}
  const relationshipNames = Object.keys(relationships)
  return mapAndMerge(relationshipNames, name => {
    const keyVar = `$${name}Key`
    const def = typeof relationships[name] === 'object'
      ? relationships[name]
      : {}
    const resourceName = def.derivedFrom
      ? (() => {
        const originRelationshipsDef = resourcesDef[def.derivedFrom.resource].relationships
        const originRelationshipName = def.derivedFrom.relationship || name
        const originRelationshipDef = originRelationshipsDef[originRelationshipName] || {}
        return originRelationshipDef.resource || originRelationshipName
      })()
      : def.resource || name
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
        fields: def.derivedFrom
          ? {
            [def.derivedFrom.resource]: {
              type: Array,
              validate: all(
                keyInResource(
                  `$${def.derivedFrom.resource}Key`,
                  def.derivedFrom.resource + '/meta'
                ),
                `root.child('${def.derivedFrom.resource}/relationships/'+$${def.derivedFrom.resource}Key+'/${parentResourceName}/'+$${parentResourceName}Key').exists()`,
                `root.child('${parentResourceName}/relationships/'+$${parentResourceName}Key+'/${def.derivedFrom.resource}/'+$${def.derivedFrom.resource}Key').exists()`
              ),
              fields: {
                ...timestampFields,
                ...def.derivedFrom.fields
              }
            },
            ...def.fields
          }
          : {
            ...timestampFields,
            ...def.fields
          }
      }),
      ...noOtherFields
    }
  })
}

export default generateRelationships
