importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

// var config = {
//     apiKey: "AIzaSyBPdrOSKvYG9KVXGO_sh42ojg-hfapvwPg",
//     authDomain: "delivmed-1528981249385.firebaseapp.com",
//     databaseURL: "https://delivmed-1528981249385.firebaseio.com",
//     projectId: "delivmed-1528981249385",
//     storageBucket: "",
//     messagingSenderId: "76947739447"
//   };
firebase.initializeApp({
  'messagingSenderId': 'YOUR-SENDER-ID'
});
firebase.initializeApp(config);

const messaging = firebase.messaging();