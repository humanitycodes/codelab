import { mapState, mapGetters } from 'vuex'
import * as lessonPermissionMethods from '@state/authorization/lessons'
import * as coursePermissionMethods from '@state/authorization/courses'

export const userGetters = {
  ...mapState({ currentUser: state => state.users.currentUser }),
  ...mapGetters(['userSignedIn'])
}

export const lessonGetters = {
  ...mapState({ lessons: state => state.lessons.all }),
  ...mapGetters([
    'currentLesson',
    'showCurrentLessonPath',
    'editCurrentLessonPath',
    'canUpdateCurrentLesson'
  ])
}
export { lessonPermissionMethods }

export const courseGetters = {
  ...mapState({ courses: state => state.courses.all }),
  ...mapGetters([
    'currentCourse',
    'canDestroyCurrentCourse'
  ])
}
export { coursePermissionMethods }
