import Vue from 'vue'
import LoginLink from '@components/login-link'

describe('login-link.vue', () => {
  it('has an MSU OAuth login url', () => {
    const defaultData = LoginLink.data()
    expect(defaultData.url).to.contain('https://oauth.ais.msu.edu/oauth/authorize')
    expect(defaultData.url).to.contain('response_type=')
    expect(defaultData.url).to.contain('client_id=')
  })

  it('renders a login link', () => {
    const vm = new Vue(LoginLink).$mount()
    expect(vm.$el.tagName).to.equal('A')
    expect(vm.$el.textContent).to.equal('Login')
  })
})
