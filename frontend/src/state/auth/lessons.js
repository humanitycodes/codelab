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
  return hasMatchingRole(['instructor'])
}

export const canReadAllLessons = () => {
  return hasMatchingRole(['instructor'])
}

// ------
// UPDATE
// ------

export const canUpdateLesson = ({ lessonKey }) => {
  return hasMatchingRole(['instructor'])
}

// -------
// DESTROY
// -------

export const canDestroyLesson = ({ lessonKey }) => {
  return (
    hasMatchingRole(['instructor']) &&
    !lessonIsInACourse(lessonKey)
  )
}

// ---------------
// PRIVATE HELPERS
// ---------------

function lessonIsInACourse (lessonKey) {
  return store.getters.courses.some(course => {
    if (!course.lessonKeys) return false
    const lessonKeys = Object.keys(course.lessonKeys)
    return (
      lessonKeys.length &&
      lessonKeys.some(key => course.lessonKeys.includes(key))
    )
  })
}
