import Vue from 'vue'
import router from '@plugins/router'
import Login from '@pages/login'

describe('login.vue', () => {
  it('saves decoded token to localStorage', () => {
    let store = {}
    sinon.stub(localStorage, 'setItem', (key, value) => {
      store[key] = value
    })

    window.location = 'http://localhost/login?token=FAKE%2BTOKEN'
    new Vue(router, Login).$mount
    console.log(store)
  })
})
