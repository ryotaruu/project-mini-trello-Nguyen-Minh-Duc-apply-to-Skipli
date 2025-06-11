import { initializeApp } from "firebase/app"
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAszj1ULiwD2xFqwO7kqI1L4UkaIe6os9U",
  authDomain: "project-mini-trello.firebaseapp.com",
  projectId: "project-mini-trello",
  storageBucket: "project-mini-trello.firebasestorage.app",
  messagingSenderId: "569874768816",
  appId: "1:569874768816:web:14048d1d6f86182f5d2c75",
  measurementId: "G-MM96T7JB0W"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firebaseDB = getFirestore(app)