import Vue from 'vue'
import GitHubAuthLink from '@components/github-auth-link'

describe('github-auth-link.vue', () => {
  it('has a GitHub OAuth login url', () => {
    const defaultData = GitHubAuthLink.data()
    expect(defaultData.url).to.contain('https://github.com/login/oauth/authorize')
    expect(defaultData.url).to.contain('client_id=')
  })

  it('renders a login link', () => {
    const vm = new Vue(GitHubAuthLink).$mount()
    expect(vm.$el.tagName).to.equal('A')
    expect(vm.$el.textContent).to.equal('Login')
  })

  it('has customizable label', () => {
    const vm = new Vue({
      ...GitHubAuthLink,
      propsData: {
        label: 'Sign Up'
      }
    }).$mount()
    expect(vm.$el.textContent).to.equal('Sign Up')
  })
})
