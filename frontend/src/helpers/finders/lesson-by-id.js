import store from '@state/store'

export default lessonId => {
  return store.getters.lessons.find(lesson => lesson.lessonId === lessonId)
}
