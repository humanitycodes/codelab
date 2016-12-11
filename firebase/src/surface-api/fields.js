import defineField from './field'

const defineFields = ({
  resourceItem,
  resourceName, resourceKey, resourceDefs,
  stateDefs,
  uid,
  db
}) => {
  const sizeDefs = resourceDefs[resourceName].fieldGroups
  // Loop through any possible sizes for that resource
  // E.g. small, large
  for (const sizeName in sizeDefs) {
    const groupDefs = sizeDefs[sizeName]
    // Loop through any possible field groups for that resource
    // E.g. authed, student, instructor
    for (const groupName in groupDefs) {
      const fieldDefs = groupDefs[groupName]
      // The path of the field
      const fieldPathArray = [
        'fieldGroups', sizeName, groupName, resourceKey
      ]
      // Loop through any possible fields for that resource
      // E.g. title, syllabus
      for (const fieldName in fieldDefs) {
        const fieldDef = fieldDefs[fieldName]
        // Get the value that we have stored locally
        // in our state, if any for that field
        const fieldValue = (
          stateDefs[resourceKey][sizeName] &&
          stateDefs[resourceKey][sizeName][groupName] &&
          stateDefs[resourceKey][sizeName][groupName][fieldName]
        ) || undefined
        defineField({
          resourceItem,
          resourceName, resourceKey,
          fieldPathArray, fieldName, fieldDef, fieldValue,
          uid,
          db
        })
      }
    }
  }
}

export default defineFields
