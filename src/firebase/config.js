import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBXvwUyX7e5SlmKNzDhYke-etRb4oCwSgk",
    authDomain: "pprova.firebaseapp.com",
    projectId: "pprova",
    storageBucket: "gs://pprova.appspot.com",
    messagingSenderId: "286710435438",
    appId: "1:286710435438:web:5221ce1486554a92f8a07f",
    measurementId: "G-TZ5DJKMR10"
  };

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

firebase.firestore().settings({experimentalForceLongPolling: true});

export {firebase};