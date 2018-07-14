import Vue from 'vue'
import Vuex from 'vuex'
import LessonsMap from '@components/lessons-map'
import router from '@plugins/router'
import store from '@state/store'

Vue.use(Vuex)

describe('lessons-map.vue', () => {
  it('for users that cannot update lessons, renders a list item for each course lesson, but not an edit button', () => {
    LessonsMap.__Rewire__('courseLessonUserStatus', () => ({}))
    store.commit('SET_ALL_LESSONS', { find: () => true })

    const vm = new Vue({
      router,
      ...LessonsMap,
      store: new Vuex.Store({
        modules: {
          users: {
            state: {
              currentUser: {}
            },
            getters: {
              currentUser () {}
            }
          }
        }
      }),
      propsData: {
        course: {
          courseKey: 'MI-449-SS17-001',
          startDate: Date.now()
        },
        lessons: [
          {
            lessonId: 1,
            title: 'foo',
            lessonKey: 'js-foo',
            prerequisiteLessonIds: []
          },
          {
            lessonId: 2,
            title: 'bar',
            lessonKey: 'js-bar',
            prerequisiteLessonIds: []
          }
        ]
      }
    }).$mount()

    const items = vm.$el.querySelectorAll(`a[href^="/courses/${vm.course.courseKey}/lessons/"]`)
    expect(items.length).to.equal(vm.lessons.length)
    ;[].slice.apply(items).forEach((item, index) => {
      const lessonTitle = item.querySelector('h3')
      expect(lessonTitle.textContent).to.contain(vm.lessons[index].title)
    })
    store.commit('SET_ALL_LESSONS', [])
    LessonsMap.__ResetDependency__('courseLessonUserStatus')
  })
})
