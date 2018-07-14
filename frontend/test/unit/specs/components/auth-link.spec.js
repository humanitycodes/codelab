import Vue from 'vue'
import AuthLink from '@components/auth-link'

describe('auth-link.vue', () => {
  const newAuthLink = provider => {
    const vm = new Vue({
      ...AuthLink,
      propsData: { provider }
    })
    Object.defineProperty(vm, 'jsonWebToken', { value: 'faketoken' })
    return vm
  }

  it('throws a prop validation when passed a bad provider', () => {
    sinon.stub(console, 'error')
    newAuthLink('kittenz!')
    expect(console.error).to.have.been.calledWithMatch('Invalid prop: custom validator check failed for prop "provider"')
    console.error.restore()
  })

  it('supports MSU OAuth login', () => {
    const vm = newAuthLink('msu').$mount()

    expect(vm.url).to.contain('https://oauth.itservices.msu.edu/oauth/authorize')
    expect(vm.url).to.contain('response_type=')
    expect(vm.url).to.contain('client_id=')
  })

  it('supports GitHub OAuth login', () => {
    const vm = newAuthLink('github')
    Object.defineProperty(vm, '$route', {
      value: { fullPath: '/my/full/path' }
    })
    vm.$mount()

    expect(vm.url).to.contain('https://github.com/login/oauth/authorize')
    expect(vm.url).to.contain('scope=')
    expect(vm.url).to.contain('client_id=')
    expect(vm.url).to.contain('state=faketoken')
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
