// Firebase Configuration for hidon1 Project
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Export to window for use in index.html
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
}
