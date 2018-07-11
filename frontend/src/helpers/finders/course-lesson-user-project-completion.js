import store from '@state/store'

export default (course, lesson, user) => {
  user = user || store.getters.currentUser
  return store.getters.projectCompletions.find(completion => (
    completion.studentUserId === user.userId &&
    completion.lessonId === lesson.lessonId &&
    completion.courseId === course.courseId
  ))
}
