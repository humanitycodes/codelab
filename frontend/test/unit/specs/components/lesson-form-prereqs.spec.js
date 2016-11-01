import Vue from 'vue'
import LessonFormPrereqs from '@components/lesson-form-prereqs'

describe('lesson-form-prereqs.vue', () => {
  it('does not allow self as a prereq option', done => {
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: { title: 'foo', '.key': 'js-foo' }
      }
    }).$mount()
    vm.lessons = [
      { title: 'foo', '.key': 'js-foo' },
      { title: 'bar', '.key': 'js-bar' }
    ]
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-bar')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo',
          prereqKeys: {
            'js-bar': true
          }
        }
      }
    }).$mount()
    vm.lessons = [
      { title: 'bar', '.key': 'js-bar' },
      { title: 'baz', '.key': 'js-baz' }
    ]
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-baz')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo'
        }
      }
    }).$mount()
    vm.lessons = [
      { title: 'bar', '.key': 'js-bar' },
      { title: 'baz', '.key': 'js-baz', prereqKeys: { 'js-foo': true } }
    ]
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-bar')
      done()
    })
  })

  it('does not show prereqs that do not match the query', done => {
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo'
        }
      }
    }).$mount()
    vm.lessons = [
      { title: 'bar boo', '.key': 'js-bar' },
      { title: 'baz baa', '.key': 'js-baz' }
    ]
    vm.prereqQuery = 'az'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-baz')
      done()

      vm.prereqQuery = 'boo'
      Vue.nextTick(() => {
        expect(vm.queryResults.length).to.equal(1)
        expect(vm.queryResults[0]['.key']).to.equal('js-bar')
        done()
      })
    })
  })
})
