import Vue from 'vue'
import App from './App'
import firebase from 'firebase'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

var config = {
  apiKey: 'AIzaSyDrrPksvwuP_pTUI_85QKzB4L7ZaxCWjCM',
  authDomain: 'msu-lansing-codes.firebaseapp.com',
  databaseURL: 'https://msu-lansing-codes.firebaseio.com',
  storageBucket: 'msu-lansing-codes.appspot.com',
  messagingSenderId: '135948358229'
}
firebase.initializeApp(config)
