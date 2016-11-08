import store from '@state/store'
import { hasMatchingRole } from './_helpers'

// ------
// CREATE
// ------

export const canCreateLesson = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ----
// READ
// ----

export const canReadLesson = ({ lessonKey }) => {
  return hasMatchingRole(['instructor', 'admin'])
}

export const canReadAllLessons = () => {
  return hasMatchingRole(['instructor', 'admin'])
}

// ------
// UPDATE
// ------

export const canUpdateLesson = ({ lessonKey }) => {
  return hasMatchingRole(['instructor', 'admin'])
}

// -------
// DESTROY
// -------

export const canDestroyLesson = ({ lessonKey }) => {
  return (
    hasMatchingRole(['instructor', 'admin']) &&
    !lessonIsInACourse(lessonKey)
  )
}

// ---------------
// PRIVATE HELPERS
// ---------------

function lessonIsInACourse (lessonKey) {
  return store.state.courses.all.some(course => {
    const lessonKeys = Object.keys(course.lessonKeys)
    return (
      lessonKeys.length &&
      lessonKeys.some(key => course.lessonKeys[key])
    )
  })
}
