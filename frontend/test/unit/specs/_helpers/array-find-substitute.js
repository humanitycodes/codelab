export default array => {
  return callback => {
    let foundLesson
    array.forEach(lesson => {
      if (callback(lesson)) {
        foundLesson = lesson
      }
    })
    return foundLesson
  }
}
