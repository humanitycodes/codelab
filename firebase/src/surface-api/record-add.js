export default ({
  resourceArray,
  resourceName,
  uid,
  db
}) => {
  // Creates a new record in Firebase with a key
  // E.g. lessons.add(lessonKey)
  resourceArray.add = function (itemKey) {
    // Initialize record with metadata
    return Promise.all([
      db.ref(resourceName)
        .child('meta')
        .child(itemKey)
        .update({
          createdAt: Date.now(),
          createdBy: uid
        })
    ])
  }
}
