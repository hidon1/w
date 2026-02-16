// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABKn0GfHYi_1UG_0sfSn68CNNz4Q9nS7g",
  authDomain: "hidon1-e4c91.firebaseapp.com",
  databaseURL: "https://hidon1-e4c91-default-rtdb.firebaseio.com",
  projectId: "hidon1-e4c91",
  storageBucket: "hidon1-e4c91.firebasestorage.app",
  messagingSenderId: "411517496015",
  appId: "1:411517496015:web:2d9c176783d062110465ba",
  measurementId: "G-FWTSZNY72T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase instances and functions
export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut as signOut,
  firebaseOnAuthStateChanged as onAuthStateChanged,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
};
