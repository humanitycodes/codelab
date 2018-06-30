// Find records that don't already have an ID
export default ({ updatedObjects, key }) =>
  updatedObjects.filter(
    updatedObject => isNaN(parseInt(updatedObject[key]))
  )
