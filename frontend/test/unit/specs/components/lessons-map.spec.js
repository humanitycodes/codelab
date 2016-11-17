import Vue from 'vue'
import LessonsMap from '@components/lessons-map'
import router from '@plugins/router'

describe('lessons.vue', () => {
  it('renders a list item for each lesson, but not edit button for users that cannot update lessons', () => {
    const vm = new Vue({
      router,
      ...LessonsMap,
      propsData: {
        lessons: [
          { title: 'foo', '.key': 'js-foo' },
          { title: 'bar', '.key': 'js-bar' }
        ]
      }
    }).$mount()

    const items = vm.$el.querySelectorAll('li')
    expect(items.length).to.equal(vm.lessons.length)
    ;[].slice.apply(items).forEach((item, index) => {
      const showLink = item.querySelector('a')
      expect(showLink.textContent).to.contain(vm.lessons[index].title)
    })
  })
})
