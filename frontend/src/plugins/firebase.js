import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'

Vue.use(VueFire)

export default Firebase.initializeApp({
  databaseURL: 'https://vuefiredemo.firebaseio.com'
}).database()

// TODO: We can change the exported database
// when authentication is ready

// export default Firebase.initializeApp({
//   apiKey: 'AIzaSyDrrPksvwuP_pTUI_85QKzB4L7ZaxCWjCM',
//   authDomain: 'msu-lansing-codes.firebaseapp.com',
//   databaseURL: 'https://msu-lansing-codes.firebaseio.com',
//   storageBucket: 'msu-lansing-codes.appspot.com',
//   messagingSenderId: '135948358229'
// }).database()
