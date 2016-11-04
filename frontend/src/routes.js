import {
  canCreateLesson, canReadLesson, canReadAllLessons, canUpdateLesson
} from '@state/authorization/lessons'

export default [
  {
    path: '/',
    component: require('@pages/home')
  },
  {
    path: '/lessons',
    component: require('@pages/lessons'),
    meta: {
      isAuthorized: canReadAllLessons
    }
  },
  {
    path: '/lessons/new',
    component: require('@pages/lesson-new'),
    meta: {
      isAuthorized: canCreateLesson
    }
  },
  {
    path: '/lessons/:lessonKey/edit',
    component: require('@pages/lesson-edit'),
    meta: {
      isAuthorized: canUpdateLesson
    }
  },
  {
    path: '/lessons/:lessonKey',
    component: require('@pages/lesson'),
    meta: {
      isAuthorized: canReadLesson
    }
  },
  {
    // This path has a required query parameter: ?token={jwt}
    // The periods in the token cause something to break when used as path param
    path: '/sign-in',
    component: require('@pages/sign-in')
  },
  {
    path: '/sign-out',
    component: require('@pages/sign-out')
  }
]
