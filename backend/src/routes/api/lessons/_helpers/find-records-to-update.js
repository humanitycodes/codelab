import boom from '@hapi/boom'

// Return updated records that have a new position or content value
export default ({ existingRecords, updatedObjects, key }) =>
  existingRecords.filter(
    existingRecord => {
      // Find the updated objects with a matching ID
      const updatedObject = updatedObjects.find(
        updatedObject => updatedObject[key] === existingRecord[key]
      )
      // If the updated object has a different position or content
      // then update the existing record and include it in the filter
      if (updatedObject && (
        existingRecord.position !== updatedObject.position ||
        existingRecord.content !== updatedObject.content
      )) {
        // Make sure the versions match
        if (existingRecord.version !== updatedObject.version) {
          throw boom.conflict()
        }
        existingRecord.position = updatedObject.position
        existingRecord.content = updatedObject.content
        return true
      }
      // If no match found or no difference, exclude record from filter
      return false
    }
  )
