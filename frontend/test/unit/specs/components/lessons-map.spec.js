import Vue from 'vue'
import LessonsMap from '@components/lessons-map'

describe('lessons.vue', () => {
  it('renders a list item for each lesson', () => {
    const vm = new Vue({
      ...LessonsMap,
      propsData: {
        lessons: [
          { title: 'foo' },
          { title: 'bar' }
        ]
      }
    }).$mount()
    expect(vm.$el.querySelectorAll('li').length)
      .to.equal(vm.lessons.length)
  })
})
