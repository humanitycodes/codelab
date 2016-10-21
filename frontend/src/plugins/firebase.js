import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import env from '@env'

Vue.use(VueFire)

export default Firebase.initializeApp(env.firebaseConfig).database()
