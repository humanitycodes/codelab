import { mapState, mapGetters } from 'vuex'
import * as lessonPermissionMethods from '@state/auth/lessons'
import * as coursePermissionMethods from '@state/auth/courses'
import * as userPermissionMethods from '@state/auth/users'

export const userGetters = {
  ...mapGetters([
    'users',
    'currentUser',
    'isUserSignedIn',
    'hasNewGitHubScopes',
    'jsonWebToken'
  ])
}
export { userPermissionMethods }

export const lessonGetters = {
  ...mapGetters([
    'lessons',
    'currentLesson',
    'editCurrentLessonPath',
    'showCurrentLessonPath'
  ]),
  ...mapState({
    canUpdateCurrentLesson (state, getters) {
      if (!getters.currentLesson) return false
      return lessonPermissionMethods.canUpdateLesson({
        lessonKey: getters.currentLesson.lessonKey
      })
    },
    canDestroyCurrentLesson (state, getters) {
      if (!getters.currentLesson) return false
      return lessonPermissionMethods.canDestroyLesson({
        lessonKey: getters.currentLesson.lessonKey
      })
    }
  })
}
export { lessonPermissionMethods }

export const courseGetters = {
  ...mapGetters([
    'courses',
    'currentCourse',
    'editCurrentCoursePath',
    'showCurrentCoursePath'
  ]),
  ...mapState({
    canUpdateCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.canUpdateCourse({
        courseKey: getters.currentCourse.courseKey
      })
    },
    shouldUpdateCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.shouldUpdateCourse({
        courseKey: getters.currentCourse.courseKey
      })
    },
    canDestroyCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.canDestroyCourse({
        courseKey: getters.currentCourse.courseKey
      })
    }
  })
}
export { coursePermissionMethods }
