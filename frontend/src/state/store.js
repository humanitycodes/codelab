import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    courses: require('./modules/courses').default,
    lessons: require('./modules/lessons').default,
    users: require('./modules/users').default
  }
})
