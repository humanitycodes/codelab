import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'

Vue.use(VueFire)

const config = {
  apiKey: 'AIzaSyA89rF1Lr7zJXNrzf38o-lv8QzerSjkG4o',
  authDomain: 'msulansingcodesdev.firebaseapp.com',
  databaseURL: 'https://msulansingcodesdev.firebaseio.com',
  storageBucket: 'msulansingcodesdev.appspot.com',
  messagingSenderId: '403150037940'
}

export default Firebase.initializeApp(config).database()
