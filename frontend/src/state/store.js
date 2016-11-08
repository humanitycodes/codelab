import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    users: require('./modules/users').default,
    lessons: require('./modules/lessons').default,
    courses: require('./modules/courses').default
  }
})
