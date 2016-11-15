import {
  canCreateLesson, canReadLesson, canReadAllLessons, canUpdateLesson
} from '@state/authorization/lessons'
import {
  canCreateCourse, canReadCourse, canReadAllCourses, canUpdateCourse
} from '@state/authorization/courses'

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
    path: '/courses',
    component: require('@pages/courses'),
    meta: {
      isAuthorized: canReadAllCourses
    }
  },
  {
    path: '/courses/new',
    component: require('@pages/course-new'),
    meta: {
      isAuthorized: canCreateCourse
    }
  },
  {
    path: '/courses/:courseKey/edit',
    component: require('@pages/course-edit'),
    meta: {
      isAuthorized: canUpdateCourse
    }
  },
  {
    path: '/courses/:courseKey',
    component: require('@pages/course'),
    meta: {
      isAuthorized: canReadCourse
    }
  },
  {
    // This is just a place to give us a place to put components.
    path: '/demos',
    component: require('@pages/demos')
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
