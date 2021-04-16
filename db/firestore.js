import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// had to use require() here because import statement did not work for some reason
const firebase = require('firebase/app');
const firestore = require("firebase/firestore");

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_CODENAMES_API_KEY,
    authDomain: "codenames-75100.firebaseapp.com",
    projectId: "codenames-75100",
    storageBucket: "codenames-75100.appspot.com",
    messagingSenderId: "223631293994",
    appId: "1:223631293994:web:b48ce4355fd24e2c4ecd53",
    measurementId: "G-P1JMSYWTRS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();