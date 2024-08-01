// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-LrCjxYT2sGgJ0t4yxzzmQ0zDCA40_jI",
  authDomain: "inventory-management-3a9da.firebaseapp.com",
  projectId: "inventory-management-3a9da",
  storageBucket: "inventory-management-3a9da.appspot.com",
  messagingSenderId: "1081770612154",
  appId: "1:1081770612154:web:3d3edfbcc813c126967983",
  measurementId: "G-338TRDJFSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}