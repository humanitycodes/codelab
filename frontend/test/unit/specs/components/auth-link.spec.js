import Vue from 'vue'
import AuthLink from '@components/auth-link'

describe('auth-link.vue', () => {
  function newAuthLink (provider) {
    return {
      ...AuthLink,
      propsData: {
        provider: provider
      }
    }
  }

  it('supports MSU OAuth login', () => {
    const vm = new Vue(newAuthLink('msu')).$mount()

    expect(vm.url).to.contain('https://oauth.ais.msu.edu/oauth/authorize')
    expect(vm.url).to.contain('response_type=')
    expect(vm.url).to.contain('client_id=')
  })

  it('supports GitHub OAuth login', () => {
    const vm = new Vue(newAuthLink('github')).$mount()

    expect(vm.url).to.contain('https://github.com/login/oauth/authorize')
    expect(vm.url).to.contain('client_id=')
  })
})
