import { mapState, mapGetters } from 'vuex'
import * as lessonPermissionMethods from '@state/auth/lessons'
import * as coursePermissionMethods from '@state/auth/courses'

export const userGetters = {
  ...mapState({
    currentUser: state => state.users.currentUser,
    users: state => state.users.all
  }),
  ...mapGetters(['userSignedIn'])
}

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
    'currentCourse',
    'showCurrentCoursePath',
    'editCurrentCoursePath'
  ]),
  ...mapState({
    canUpdateCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.canUpdateCourse({
        courseKey: getters.currentCourse['.key']
      })
    },
    shouldUpdateCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.shouldUpdateCourse({
        courseKey: getters.currentCourse['.key']
      })
    },
    canDestroyCurrentCourse (state, getters) {
      if (!getters.currentCourse) return false
      return coursePermissionMethods.canDestroyCourse({
        courseKey: getters.currentCourse['.key']
      })
    }
  })
}
export { coursePermissionMethods }
