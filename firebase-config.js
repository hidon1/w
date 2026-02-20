// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  limit,
  collectionGroup
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getBlob,
  getDownloadURL,
  deleteObject
} from 'https://www.gstatic.com/firebasejs/12.9.0/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_tulsSjZTB0F0ya34N2XUD67a77BTWpw",
  authDomain: "wine-f57cb.firebaseapp.com",
  projectId: "wine-f57cb",
  storageBucket: "wine-f57cb.firebasestorage.app",
  messagingSenderId: "172638778743",
  appId: "1:172638778743:web:85045c1b2eeefeb2c11d72",
  measurementId: "G-6D6L2W94D6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export Firebase instances and functions
export {
  app,
  analytics,
  auth,
  db,
  storage,
  storageRef,
  uploadBytes,
  getBlob,
  getDownloadURL,
  deleteObject,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firebaseSignOut as signOut,
  firebaseOnAuthStateChanged as onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  doc,
  collection,
  getDocs,
  query,
  where,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  limit,
  collectionGroup
};
