export default ({
  resourceArray,
  resourceName, resourceDefs,
  db
}) => {
  // Deletes an existing record in Firebase with a key
  // E.g. lessons.remove(lessonKey)
  resourceArray.remove = function (itemKey) {
    const firebaseActions = []
    // Delete metadata for record in Firebase
    firebaseActions.push(
      db.ref(resourceName)
        .child('meta')
        .child(itemKey)
        .remove()
    )
    // Delete all fields for a record in Firebase
    const sizeDefs = resourceDefs[resourceName].fieldGroups
    for (const sizeName in sizeDefs) {
      const groupDefs = sizeDefs[sizeName]
      for (const groupName in groupDefs) {
        firebaseActions.push(
          db.ref(`${resourceName}/fieldGroups`)
            .child(sizeName)
            .child(groupName)
            .child(itemKey)
            .remove()
        )
      }
    }
    // TODO: Also delete relationships, by pulling in all
    // relationships of the deleted resource that exist
    // and deleting their inverse
    return Promise.all(firebaseActions)
  }
}
