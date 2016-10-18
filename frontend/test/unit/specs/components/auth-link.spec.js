import Vue from 'vue'
import AuthLink from '@components/auth-link'

describe('auth-link.vue', () => {
  it('renders a login link', () => {
    const vm = new Vue(AuthLink).$mount()
    expect(vm.$el.tagName).to.equal('A')
    expect(vm.$el.textContent).to.equal('Login')
  })

  it('has customizable label', () => {
    const vm = new Vue({
      ...AuthLink,
      propsData: {
        label: 'Sign Up'
      }
    }).$mount()
    expect(vm.$el.textContent).to.equal('Sign Up')
  })
})
