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
    // 'canUpdateCurrentLesson',
    // 'canDestroyCurrentLesson'
  ])
}
export { lessonPermissionMethods }

export const courseGetters = {
  ...mapGetters([
    'courses',
    'currentCourse',
    'showCurrentCoursePath',
    'editCurrentCoursePath'
    // 'canUpdateCurrentCourse',
    // 'shouldUpdateCurrentCourse',
    // 'canDestroyCurrentCourse'
  ])
}
export { coursePermissionMethods }
