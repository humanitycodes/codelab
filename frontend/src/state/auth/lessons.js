import store from '@state/store'
import { hasMatchingRole } from './_helpers'

// ------
// CREATE
// ------

export const canCreateLesson = () => {
  return hasMatchingRole(['instructor'])
}

// ----
// READ
// ----

export const canReadLesson = ({ lessonKey }) => {
  return doesLessonExist(lessonKey) &&
    hasMatchingRole(['instructor'])
}

export const canReadAllLessons = () => {
  return hasMatchingRole(['instructor'])
}

// ------
// UPDATE
// ------

export const canUpdateLesson = ({ lessonKey }) => {
  return doesLessonExist(lessonKey) &&
    hasMatchingRole(['instructor'])
}

// -------
// DESTROY
// -------

export const canDestroyLesson = ({ lessonKey }) => {
  return doesLessonExist(lessonKey) &&
    (
      hasMatchingRole(['instructor']) &&
      !lessonIsInACourse(lessonKey)
    )
}

// ---------------
// PRIVATE HELPERS
// ---------------

function lessonIsInACourse (lessonKey) {
  const lesson = findLesson(lessonKey)
  return lesson && lesson.courseIds && lesson.courseIds.length > 0
}

function findLesson (lessonKey) {
  return store.getters.lessons.find(lesson => lesson.lessonKey === lessonKey)
}

function doesLessonExist (lessonKey) {
  return !!findLesson(lessonKey)
}
