import {
  canCreateLesson, canReadAllLessons, canUpdateLesson
} from '@state/auth/lessons'
import {
  canCreateCourse, canReadCourse, canReadAllCourses, canUpdateCourse
} from '@state/auth/courses'
import courseByKey from '@helpers/finders/course-by-key'
import store from '@state/store'

// For routes that only staff are likely to access,
// require.ensure is used to lazy-load those modules
// so that students can download a much smaller
// bundle that only includes the parts of the app
// that they need to access.

export default [
  {
    path: '/',
    meta: {
      isPublic: true
    },
    redirect: to => {
      if (store.state.users.currentUser) {
        const courses = store.state.courses.all
        return canReadAllCourses()
        ? '/code-reviews'
          : courses.length === 1
            ? '/courses/' + courses[0]['.key']
            : '/courses'
      }
      return '/msu-sign-in'
    }
  },
  {
    path: '/lessons',
    component: cb => require.ensure([], () => cb(require('@pages/lessons')), 'staff'),
    meta: {
      isAuthorized: canReadAllLessons,
      layout: 'full'
    }
  },
  {
    path: '/lessons/new',
    component: cb => require.ensure([], () => cb(require('@pages/lesson-new')), 'staff'),
    meta: {
      isAuthorized: canCreateLesson
    }
  },
  {
    path: '/lessons/:lessonKey/edit',
    component: cb => require.ensure([], () => cb(require('@pages/lesson-edit')), 'staff'),
    meta: {
      isAuthorized: canUpdateLesson
    }
  },
  {
    path: '/courses',
    component: require('@pages/courses')
  },
  {
    path: '/courses/new',
    component: cb => require.ensure([], () => cb(require('@pages/course-new')), 'staff'),
    meta: {
      isAuthorized: canCreateCourse
    }
  },
  {
    path: '/courses/:courseKey/edit',
    beforeEnter: (to, from, next) => {
      const course = courseByKey(to.params.courseKey)
      const currentUserKey = store.state.users.currentUser.uid
      return course.instructorKeys.indexOf(currentUserKey) !== -1
        ? next() : next({ name: 'course-view', params: to.params })
    },
    component: cb => require.ensure([], () => cb(require('@pages/course-edit')), 'staff'),
    meta: {
      isAuthorized: canUpdateCourse
    }
  },
  {
    path: '/courses/:courseKey',
    name: 'course-view',
    component: require('@pages/course'),
    meta: {
      isAuthorized: canReadCourse,
      layout: 'full'
    }
  },
  {
    path: '/courses/:courseKey/lessons/:lessonKey',
    redirect: '/courses/:courseKey/lessons/:lessonKey/1'
  },
  {
    path: '/courses/:courseKey/lessons/:lessonKey/:currentPage/:currentView?',
    component: require('@pages/course-lesson'),
    meta: {
      isAuthorized: canReadCourse
    }
  },
  {
    path: '/code-reviews',
    component: require('@pages/code-reviews'),
    meta: {
      isAuthorized: canReadAllCourses,
      layout: 'full'
    }
  },
  {
    path: '/student-progress',
    component: require('@pages/student-progress'),
    meta: {
      isAuthorized: canReadAllCourses,
      layout: 'full'
    }
  },
  // We do not need this live for now.
  // {
  //   // This is just a place to give us a place to put components.
  //   path: '/demos',
  //   component: require('@pages/demos')
  // },
  {
    path: '/msu-sign-in',
    component: require('@pages/sign-in-msu'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/email-sign-in',
    component: require('@pages/sign-in-email'),
    meta: {
      isPublic: true
    }
  },
  {
    // This path has a required query parameter: ?token={jwt}
    // The periods in the token cause something to break when used as path param
    path: '/sign-in',
    component: require('@pages/sign-in'),
    meta: {
      isPublic: true
    }
  },
  {
    path: '/sign-out',
    component: require('@pages/sign-out')
  },
  {
    path: '*',
    name: 'not-found',
    component: require('@pages/not-found')
  }
]
