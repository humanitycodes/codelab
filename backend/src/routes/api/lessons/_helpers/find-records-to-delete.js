// Find records that don't match any of the updated objects
export default ({ existingRecords, updatedObjects, key }) =>
  existingRecords.filter(
    existingRecord => !updatedObjects.some(
      updatedObject => updatedObject[key] === existingRecord[key]
    )
  )
