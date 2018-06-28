import { mapState, mapGetters } from 'vuex'
import * as lessonPermissionMethods from '@state/auth/lessons'
import * as coursePermissionMethods from '@state/auth/courses'
import * as userPermissionMethods from '@state/auth/users'

export const userGetters = {
  ...mapState({
    currentUser: state => state.users.currentUser
  }),
  ...mapGetters([
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
    'showCurrentLessonPath',
    'editCurrentLessonPath'
  ]),
  ...mapState({
    canUpdateCurrentLesson (state, getters) {
      if (!getters.currentLesson) return false
      return lessonPermissionMethods.canUpdateLesson({
        lessonKey: getters.currentLesson['.key']
      })
    },
    canDestroyCurrentLesson (state, getters) {
      if (!getters.currentLesson) return false
      return lessonPermissionMethods.canDestroyLesson({
        lessonKey: getters.currentLesson['.key']
      })
    }
  })
}
export { lessonPermissionMethods }

export const courseGetters = {
  ...mapGetters([
    'courses',
    'currentCourse'
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
