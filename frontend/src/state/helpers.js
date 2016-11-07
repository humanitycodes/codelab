import { mapState, mapGetters } from 'vuex'
import * as lessonPermissionMethods from '@state/authorization/lessons'

export const userGetters = {
  ...mapState({ currentUser: state => state.users.currentUser }),
  ...mapGetters(['userSignedIn'])
}

export const lessonGetters = {
  ...mapState({ lessons: state => state.lessons.all }),
  ...mapGetters([
    'currentLesson', 'showCurrentLessonPath', 'editCurrentLessonPath',
    'canUpdateCurrentLesson'
  ])
}
export { lessonPermissionMethods }
