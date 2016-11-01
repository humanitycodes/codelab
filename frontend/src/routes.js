export default [
  {
    path: '/',
    component: require('@pages/home')
  },
  {
    path: '/lessons',
    component: require('@pages/lessons')
  },
  {
    path: '/lessons/new',
    component: require('@pages/lesson-new')
  },
  {
    path: '/lessons/:key/edit',
    component: require('@pages/lesson-edit')
  },
  {
    path: '/lessons/:key',
    component: require('@pages/lesson')
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
