import Vue from 'vue'
import LessonFormPrereqs from '@components/lesson-form-prereqs'

describe('lesson-form-prereqs.vue', () => {
  it('does not allow self as a prereq option', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { lessonId: 1, title: 'foo', lessonKey: 'js-foo' },
      { lessonId: 2, title: 'bar', lessonKey: 'js-bar' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          lessonId: 1,
          title: 'foo',
          lessonKey: 'js-foo',
          prerequisiteLessonIds: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0].lessonKey).to.equal('js-bar')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { lessonId: 2, title: 'bar', lessonKey: 'js-bar' },
      { lessonId: 3, title: 'baz', lessonKey: 'js-baz' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          lessonId: 1,
          lessonKey: 'js-foo',
          title: 'foo',
          prerequisiteLessonIds: [2]
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0].lessonKey).to.equal('js-baz')
      done()
    })
  })

  it('does not allow lessons that are already a prereq', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { lessonId: 2, title: 'bar', lessonKey: 'js-bar' },
      {
        lessonId: 3,
        title: 'baz',
        lessonKey: 'js-baz',
        prerequisiteLessonIds: [1]
      }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          lessonId: 1,
          lessonKey: 'js-foo',
          title: 'foo',
          prerequisiteLessonIds: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'js'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0].lessonKey).to.equal('js-bar')
      done()
    })
  })

  it('does not show prereqs that do not match the query', done => {
    LessonFormPrereqs.computed.lessons = () => [
      { lessonId: 2, title: 'bar boo', lessonKey: 'js-bar' },
      { lessonId: 3, title: 'baz baa', lessonKey: 'js-baz' }
    ]
    const vm = new Vue({
      ...LessonFormPrereqs,
      propsData: {
        lesson: {
          lessonId: 1,
          lessonKey: 'js-foo',
          title: 'foo',
          prerequisiteLessonIds: []
        }
      }
    }).$mount()
    vm.prereqQuery = 'az'
    Vue.nextTick(() => {
      expect(vm.queryResults.length).to.equal(1)
      expect(vm.queryResults[0].lessonKey).to.equal('js-baz')
      vm.prereqQuery = 'boo'
      Vue.nextTick(() => {
        expect(vm.queryResults.length).to.equal(1)
        expect(vm.queryResults[0].lessonKey).to.equal('js-bar')
        done()
      })
    })
  })
})
