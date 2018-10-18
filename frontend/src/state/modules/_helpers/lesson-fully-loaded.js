export default lesson => (
  lesson &&
  (
    (lesson.content && lesson.content.length) ||
    (lesson.notes && lesson.notes.length)
  )
)
