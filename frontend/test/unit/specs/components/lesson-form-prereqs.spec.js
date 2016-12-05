import Vue from 'vue'
import LessonFormPrereqs from '@components/lesson-form-prereqs'

describe('lesson-form-prereqs.vue', () => {
  it('does not allow self as a prereq option', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { title: 'foo', '.key': 'js-foo' },
      { title: 'bar', '.key': 'js-bar' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          title: 'foo',
          '.key': 'js-foo',
          prereqKeys: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-bar')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { title: 'bar', '.key': 'js-bar' },
      { title: 'baz', '.key': 'js-baz' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo',
          prereqKeys: ['js-bar']
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-baz')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { title: 'bar', '.key': 'js-bar' },
      { title: 'baz', '.key': 'js-baz', prereqKeys: { 'js-foo': true } }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo',
          prereqKeys: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-bar')
      done()
    })
  })

  it('does not show prereqs that do not match the query', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { title: 'bar boo', '.key': 'js-bar' },
      { title: 'baz baa', '.key': 'js-baz' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          '.key': 'js-foo',
          title: 'foo',
          prereqKeys: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'az'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0]['.key']).to.equal('js-baz')
      vm.prereqQuery = 'boo'
      Vue.nextTick(() => {
        expect(vm.queryResults.length).to.equal(1)
        expect(vm.queryResults[0]['.key']).to.equal('js-bar')
        done()
      })
    })
  })
})
