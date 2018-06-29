import store from '@state/store'

export default lessonKey => {
  return store.getters.lessons.find(lesson => lesson.lessonKey === lessonKey)
}
