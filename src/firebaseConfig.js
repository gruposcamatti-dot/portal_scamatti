// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Substitui estes valores pelos que copiaste do Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDEH_KYVt62F0KEuVh8qgZqu0SmjP7UKK8",
  authDomain: "portal-scamatti.firebaseapp.com",
  projectId: "portal-scamatti",
  storageBucket: "portal-scamatti.firebasestorage.app",
  messagingSenderId: "54471460240",
  appId: "1:54471460240:web:c4be92b193013dd7525f15"
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