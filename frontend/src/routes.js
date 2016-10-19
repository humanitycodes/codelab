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
  }
]
