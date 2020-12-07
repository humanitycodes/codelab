import Vue from 'vue'
import Vuex from 'vuex'

import courses from './modules/courses'
import lessons from './modules/lessons'
import projectCompletions from './modules/project-completions'
import resourceJournal from './modules/resource-journal'
import users from './modules/users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    courses,
    lessons,
    projectCompletions,
    resourceJournal,
    users
  }
})
