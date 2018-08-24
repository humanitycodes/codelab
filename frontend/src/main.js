import Vue from 'vue'
import App from './app'
import initStore from '@state/init-store'
import router from '@plugins/router'
import LoadingScreen from '@components/loading-screen'
import camelize from '@helpers/utils/camelize'
import capitalize from '@helpers/utils/capitalize'

// Show a loading message until we have the data needed
// to authorize routes in our app
new Vue(LoadingScreen).$mount('#app') // eslint-disable-line no-new

const requireGlobalComponent = require.context('@components/globals', true, /\.(js|vue)$/i)
requireGlobalComponent.keys().forEach(path => {
  const fileName = path.match(/^\.\/([\w-]+)\.(?:js|vue)$/i)[1]
  const componentName = capitalize(camelize(fileName))
  const componentModule = requireGlobalComponent(path)
  const component = componentModule.default || componentModule
  Vue.component(componentName, component)
})

// Once we have the information used to authorize
// routes, we can run the main app
initStore().then(store => {
  new Vue({ // eslint-disable-line no-new
    el: '#app',
    store,
    router,
    render: h => h(App)
  })
})
