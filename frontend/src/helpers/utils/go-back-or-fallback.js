import router from '@plugins/router'

export default (fallbackRoute = '/') => {
  window.history.length > 1
    ? router.go(-1)
    : router.push(fallbackRoute)
}
