import Vue from 'vue'
import LessonsMap from '@components/lessons-map'
import router from '@plugins/router'

describe('lessons-map.vue', () => {
  it('for users that cannot update lessons, renders a list item for each course lesson, but not an edit button', () => {
    const vm = new Vue({
      router,
      ...LessonsMap,
      propsData: {
        course: {
          '.key': 'MI-449-SS17-001',
          startDate: Date.now()
        },
        lessons: [
          { title: 'foo', '.key': 'js-foo', prereqKeys: [] },
          { title: 'bar', '.key': 'js-bar', prereqKeys: [] }
        ]
      }
    }).$mount()

    const items = vm.$el.querySelectorAll(`a[href^="/courses/${vm.course['.key']}/lessons/"]`)
    expect(items.length).to.equal(vm.lessons.length)
    ;[].slice.apply(items).forEach((item, index) => {
      const lessonTitle = item.querySelector('h3')
      expect(lessonTitle.textContent).to.contain(vm.lessons[index].title)
    })
  })
})
