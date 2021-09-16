// Import the functions you need from the SDKs you need
import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import { config } from './config';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: config.API_KEY,
    authDomain: "chatapptest-e8ef1.firebaseapp.com",
    databaseURL: "https://chatapptest-e8ef1.firebaseio.com",
    projectId: "chatapptest-e8ef1",
    storageBucket: "chatapptest-e8ef1.appspot.com",
    messagingSenderId: "79826239382",
    appId: "1:79826239382:web:fb558c3188a2e37aeb67b7",
    measurementId: "G-EVCZ1KST0L"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
export { db, auth };