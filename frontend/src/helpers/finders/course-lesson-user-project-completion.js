import store from '@state/store'

export default (course, lesson, user) => {
  if (!user) {
    user = store.state.users.currentUser
  }
  if (!course.projectCompletions) return null
  return course.projectCompletions.find(completion => {
    return (
      completion.students.some(student => {
        return (
          student['.key'] === user.uid ||
          student['.key'] === user['.key']
        )
      }) &&
      lesson['.key'] === completion.lessonKey
    )
  })
}
