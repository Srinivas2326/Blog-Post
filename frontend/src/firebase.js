// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5GX_RxUFWujSy8eXOA1MEVCAtOz5rjkI",
  authDomain: "blog-post-b59c9.firebaseapp.com",
  projectId: "blog-post-b59c9",
  storageBucket: "blog-post-b59c9.appspot.com",
  messagingSenderId: "885047830328",
  appId: "1:885047830328:web:208db92d77050f01cf03cd",
  measurementId: "G-9251XNR41N"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
