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
    path: '/lessons/:key',
    component: require('@pages/lesson')
  },
  {
    // This path has a required query parameter: ?token={jwt}
    // The periods in the token cause something to break when used as path param
    path: '/login',
    component: require('@pages/login')
  }
]
