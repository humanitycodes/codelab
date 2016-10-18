import Vue from 'vue'
import MsuAuthLink from '@components/msu-auth-link'

describe('msu-auth-link.vue', () => {
  it('has an MSU OAuth login url', () => {
    const defaultData = MsuAuthLink.data()
    expect(defaultData.url).to.contain('https://oauth.ais.msu.edu/oauth/authorize')
    expect(defaultData.url).to.contain('response_type=')
    expect(defaultData.url).to.contain('client_id=')
  })

  it('renders a login link', () => {
    const vm = new Vue(MsuAuthLink).$mount()
    expect(vm.$el.tagName).to.equal('A')
    expect(vm.$el.textContent).to.equal('Login')
  })

  it('has customizable label', () => {
    const vm = new Vue({
      ...MsuAuthLink,
      propsData: {
        label: 'Sign Up'
      }
    }).$mount()
    expect(vm.$el.textContent).to.equal('Sign Up')
  })
})
