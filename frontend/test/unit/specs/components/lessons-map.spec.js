import Vue from 'vue'
import LessonsMap from '@components/lessons-map'
import router from '@plugins/router'

describe('lessons.vue', () => {
  it('renders a list item for each lesson', () => {
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
      const editButton = item.querySelector('button')
      expect(editButton.textContent).to.contain('Edit')
      expect(editButton.parentNode.tagName).to.equal('A')
      expect(editButton.parentNode.getAttribute('href'))
        .to.equal(`/lessons/${vm.lessons[index]['.key']}/edit`)
      const showLink = item.querySelector(`a[href="/lessons/${vm.lessons[index]['.key']}"]`)
      expect(showLink.textContent).to.contain(vm.lessons[index].title)
    })
  })
})
