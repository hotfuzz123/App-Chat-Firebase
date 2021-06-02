import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyDhw9rVL16hjJFmSQckWH_2Jh51pcKJBWw",
    authDomain: "react-slack-clone-c0bb3.firebaseapp.com",
    databaseURL: "https://react-slack-clone-c0bb3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "react-slack-clone-c0bb3",
    storageBucket: "react-slack-clone-c0bb3.appspot.com",
    messagingSenderId: "361492505128",
    appId: "1:361492505128:web:9408d1b0ab70befd1e4b1d",
    measurementId: "G-R8CL8EFNCT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase
