import Vue from 'vue'
import Dropdown from '@components/dropdown'

describe('dropdown.vue', () => {
  it('throws a validation error with missing results', () => {
    sinon.stub(console, 'error')
    new Vue({ // eslint-disable-line no-new
      ...Dropdown,
      propsData: { resultHandler: () => {} }
    })
    expect(console.error).to.have.been.calledWithMatch('Missing required prop: "results"')
    console.error.restore()
  })

  it('throws a validation error with missing resultHandler', () => {
    sinon.stub(console, 'error')
    new Vue({ // eslint-disable-line no-new
      ...Dropdown,
      propsData: { results: ['a', 'b', 'c'] }
    })
    expect(console.error).to.have.been.calledWithMatch('Missing required prop: "resultHandler"')
    console.error.restore()
  })

  it('just displays the raw result when passed no resultContent function', () => {
    const vm = new Vue({ // eslint-disable-line no-new
      ...Dropdown,
      propsData: {
        results: ['a', 'b', 'c'],
        resultHandler: () => {}
      }
    }).$mount()
    const results = vm.$el.querySelectorAll('.dropdown-results li')
    ;[].slice.apply(results).forEach((result, index) => {
      expect(result.textContent).to.equal(vm.results[index])
    })
  })

  it('uses the resultContent function when passed one', () => {
    const vm = new Vue({ // eslint-disable-line no-new
      ...Dropdown,
      propsData: {
        results: ['a', 'b', 'c'],
        resultHandler: item => item + 'foo'
      }
    }).$mount()
    const results = vm.$el.querySelectorAll('.dropdown-results li')
    ;[].slice.apply(results).forEach((result, index) => {
      expect(result.textContent).to.equal(vm.results[index] + 'foo')
    })
  })

  it('does not render a dropdown when results is empty', () => {
    const vm = new Vue({
      ...Dropdown,
      propsData: {
        results: [],
        resultHandler: function () {}
      }
    }).$mount()
    expect(vm.$el.className).not.to.contain('expanded')
    const resultsWrapper = vm.$el.querySelector('.dropdown-results')
    expect(resultsWrapper.style.display).to.equal('none')
  })

  it('renders a dropdown when results exist', () => {
    const vm = new Vue({
      ...Dropdown,
      propsData: {
        results: ['a', 'b', 'c'],
        resultHandler: function () {}
      }
    }).$mount()
    expect(vm.$el.className).to.contain('expanded')
    const resultsWrapper = vm.$el.querySelector('.dropdown-results')
    expect(resultsWrapper.style.display).not.to.equal('none')
  })

  it('renders a dropdown when results exist', () => {
    const vm = new Vue({
      ...Dropdown,
      propsData: {
        results: ['a', 'b', 'c'],
        resultHandler: function () {}
      }
    }).$mount()
    expect(vm.$el.className).to.contain('expanded')
    const resultsWrapper = vm.$el.querySelector('.dropdown-results')
    expect(resultsWrapper.style.display).not.to.equal('none')
  })
})
