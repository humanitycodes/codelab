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

  it('throws a prop validation when passed a bad provider', () => {
    sinon.stub(console, 'error')
    new Vue(newAuthLink('kittenz!')) // eslint-disable-line no-new
    expect(console.error).to.have.been.calledWithMatch('Invalid prop: custom validator check failed for prop "provider"')
    console.error.restore()
  })

  it('supports MSU OAuth login', () => {
    const vm = new Vue(newAuthLink('msu')).$mount()

    expect(vm.url).to.contain('https://oauth.ais.msu.edu/oauth/authorize')
    expect(vm.url).to.contain('response_type=')
    expect(vm.url).to.contain('client_id=')
  })

  it('supports GitHub OAuth login', () => {
    const vm = new Vue(newAuthLink('github'))
    Object.defineProperty(vm, '$route', {
      value: { fullPath: '/my/full/path' }
    })
    vm.$mount()

    expect(vm.url).to.contain('https://github.com/login/oauth/authorize')
    expect(vm.url).to.contain('scope=')
    expect(vm.url).to.contain('client_id=')
  })

  it('renders an anchor with the slot contents', () => {
    const slotContents = 'kittenz!'
    const vm = new Vue({
      template: `
        <AuthLink provider="msu">
          ${slotContents}
        </AuthLink>
      `,
      components: { AuthLink }
    }).$mount()
    expect(vm.$el.tagName).to.equal('A')
    expect(vm.$el.textContent.trim()).to.equal(slotContents)
  })
})
