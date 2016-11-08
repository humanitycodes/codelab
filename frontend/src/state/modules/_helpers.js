import Vue from 'vue'

export const createFirebaseVM = (config) => {
  return new Promise((resolve, reject) => {
    const vm = new Vue({
      firebase: config,
      created () {
        const refs = this.$firebaseRefs
        Promise.all(
          Object.keys(refs).map(refName => {
            return refs[refName].once('value')
          })
        )
        .then(() => { resolve(vm) })
        .catch(reject)
      }
    })
  })
}
