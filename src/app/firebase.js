// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-Lt4EMdnLZ7QRllN3dWh1xxy6QSQNFXc",
  authDomain: "emotify-16cfd.firebaseapp.com",
  projectId: "emotify-16cfd",
  storageBucket: "emotify-16cfd.appspot.com",
  messagingSenderId: "840740842643",
  appId: "1:840740842643:web:00348a09ac46039324f166"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)