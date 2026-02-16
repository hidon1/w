// Firebase Storage Module - replaces storage-local.js
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from './firebase-config.js';

// Local storage keys (for offline support)
const STORAGE_KEYS = {
  PROJECTS: 'projects',
  REMINDERS: 'reminders',
  INBOX: 'inbox',
  PREFERENCES: 'preferences',
  STAGES_CONFIG: 'stagesConfig'
};

// Current user reference
let currentUser = null;

// Set current user
function setCurrentUser(user) {
  currentUser = user;
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// High-level save/load functions for the application

// Save projects to both localStorage and Firestore
async function saveProjects(projects) {
  // Always save to localStorage first
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  
  // If user is authenticated, also save to Firestore
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'projects');
      await setDoc(userDocRef, {
        projects: projects,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving projects to Firestore:', error);
    }
  }
}

// Load projects from Firestore or localStorage
async function loadProjects() {
  // If user is authenticated, try to load from Firestore
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'projects');
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Also save to localStorage for offline access
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
        return data.projects || {};
      }
    } catch (error) {
      console.error('Error loading projects from Firestore:', error);
    }
  }
  
  // Fallback to localStorage
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : {};
}

// Save reminders to both localStorage and Firestore
async function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'reminders');
      await setDoc(userDocRef, {
        reminders: reminders,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving reminders to Firestore:', error);
    }
  }
}

// Load reminders from Firestore or localStorage
async function loadReminders() {
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'reminders');
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.reminders));
        return data.reminders || [];
      }
    } catch (error) {
      console.error('Error loading reminders from Firestore:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
  return data ? JSON.parse(data) : [];
}

// Save inbox to both localStorage and Firestore
async function saveInbox(inbox) {
  localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(inbox));
  
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'inbox');
      await setDoc(userDocRef, {
        inbox: inbox,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving inbox to Firestore:', error);
    }
  }
}

// Load inbox from Firestore or localStorage
async function loadInbox() {
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'inbox');
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(data.inbox));
        return data.inbox || [];
      }
    } catch (error) {
      console.error('Error loading inbox from Firestore:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.INBOX);
  return data ? JSON.parse(data) : [];
}

// Save preferences to both localStorage and Firestore
async function savePreferences(preferences) {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
  
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'preferences');
      await setDoc(userDocRef, {
        preferences: preferences,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving preferences to Firestore:', error);
    }
  }
}

// Load preferences from Firestore or localStorage
async function loadPreferences() {
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'preferences');
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
        return data.preferences || {};
      }
    } catch (error) {
      console.error('Error loading preferences from Firestore:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {};
}

// Save stages config to both localStorage and Firestore
async function saveStagesConfig(config) {
  localStorage.setItem(STORAGE_KEYS.STAGES_CONFIG, JSON.stringify(config));
  
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'projects');
      await setDoc(userDocRef, {
        stagesConfig: config,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Error saving stages config to Firestore:', error);
    }
  }
}

// Load stages config from Firestore or localStorage
async function loadStagesConfig() {
  if (currentUser) {
    try {
      const userDocRef = doc(db, 'accounts', currentUser.uid, 'data', 'projects');
      const docSnap = await getDoc(userDocRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.stagesConfig) {
          localStorage.setItem(STORAGE_KEYS.STAGES_CONFIG, JSON.stringify(data.stagesConfig));
          return data.stagesConfig;
        }
      }
    } catch (error) {
      console.error('Error loading stages config from Firestore:', error);
    }
  }
  
  const data = localStorage.getItem(STORAGE_KEYS.STAGES_CONFIG);
  return data ? JSON.parse(data) : null;
}

// Authentication functions

// Sign in with Google
async function signInWithGoogle() {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    // If popup is blocked, try redirect
    if (error.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
      return null; // Will continue after redirect
    }
    throw error;
  }
}

// Register with email and password
async function registerWithEmail(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document in Firestore
  const userDocRef = doc(db, 'accounts', result.user.uid);
  await setDoc(userDocRef, {
    email: result.user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return result.user;
}

// Sign in with email and password
async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// Sign out
async function signOutUser() {
  await signOut(auth);
  currentUser = null;
}

// Export all functions
export {
  auth,
  db,
  googleProvider,
  signInWithGoogle,
  registerWithEmail,
  signInWithEmail,
  signOutUser,
  onAuthStateChanged,
  setCurrentUser,
  getCurrentUser,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  saveProjects,
  loadProjects,
  saveReminders,
  loadReminders,
  saveInbox,
  loadInbox,
  savePreferences,
  loadPreferences,
  saveStagesConfig,
  loadStagesConfig
};
