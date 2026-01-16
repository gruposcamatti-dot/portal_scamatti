// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Substitui estes valores pelos que copiaste do Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSy...", 
  authDomain: "portal-scamatti.firebaseapp.com",
  projectId: "portal-scamatti",
  storageBucket: "portal-scamatti.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Função auxiliar de Login
export const loginComGoogle = () => {
  return signInWithPopup(auth, provider);
};

// Função auxiliar de Logout
export const fazerLogout = () => {
  return signOut(auth);
};