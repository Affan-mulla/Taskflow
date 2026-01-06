// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtjc5Cw168pdyvEIRuoo-5YHtlQNXa9pE",
  authDomain: "taskflow-7.firebaseapp.com",
  projectId: "taskflow-7",
  storageBucket: "taskflow-7.firebasestorage.app",
  messagingSenderId: "1000029298004",
  appId: "1:1000029298004:web:efe522a5c58cfc47843cc1",
  measurementId: "G-ZVJ3KZT9D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);