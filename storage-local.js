// Local Storage Module - replaces Firebase
// This module provides localStorage-based storage with an API similar to Firebase

// Mock auth object (no authentication, always local)
const auth = null;

// Mock auth provider (not used in local mode)
const googleProvider = null;

// Mock database object
const db = null;

// Local storage keys
const STORAGE_KEYS = {
  PROJECTS: 'projects',
  REMINDERS: 'reminders',
  INBOX: 'inbox',
  PREFERENCES: 'preferences',
  STAGES_CONFIG: 'stagesConfig'
};

// Mock onAuthStateChanged - always calls with null (no user)
function onAuthStateChanged(authObj, callback) {
  // Call immediately with no user (local-only mode)
  setTimeout(() => callback(null), 0);
  // Return unsubscribe function
  return () => {};
}

// Mock signInWithPopup - not supported in local mode
async function signInWithPopup(authObj, provider) {
  throw new Error('Authentication not supported in local-only mode');
}

// Mock signOut - not supported in local mode
async function signOut(authObj) {
  throw new Error('Authentication not supported in local-only mode');
}

// Mock collection - returns a reference string
function collection(dbObj, collectionName) {
  return collectionName;
}

// Mock doc - returns a reference object
function doc(dbObj, collectionName, docId) {
  return { collection: collectionName, id: docId };
}

// Get a document from localStorage
async function getDoc(docRef) {
  const key = `${docRef.collection}/${docRef.id}`;
  const data = localStorage.getItem(key);
  
  return {
    exists: () => data !== null,
    data: () => data ? JSON.parse(data) : null
  };
}

// Set a document in localStorage
async function setDoc(docRef, data, options = {}) {
  const key = `${docRef.collection}/${docRef.id}`;
  
  if (options.merge) {
    // Merge with existing data
    const existing = localStorage.getItem(key);
    const existingData = existing ? JSON.parse(existing) : {};
    const mergedData = { ...existingData, ...data };
    localStorage.setItem(key, JSON.stringify(mergedData));
  } else {
    // Replace entire document
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Update a document in localStorage
async function updateDoc(docRef, data) {
  const key = `${docRef.collection}/${docRef.id}`;
  const existing = localStorage.getItem(key);
  const existingData = existing ? JSON.parse(existing) : {};
  const updatedData = { ...existingData, ...data };
  localStorage.setItem(key, JSON.stringify(updatedData));
}

// Delete a document from localStorage
async function deleteDoc(docRef) {
  const key = `${docRef.collection}/${docRef.id}`;
  localStorage.removeItem(key);
}

// Mock serverTimestamp - returns current timestamp
function serverTimestamp() {
  return Date.now();
}

// High-level save/load functions for the application

// Save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjects() {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : {};
}

// Save reminders to localStorage
function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
}

// Load reminders from localStorage
function loadReminders() {
  const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
  return data ? JSON.parse(data) : [];
}

// Save inbox to localStorage
function saveInbox(inbox) {
  localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(inbox));
}

// Load inbox from localStorage
function loadInbox() {
  const data = localStorage.getItem(STORAGE_KEYS.INBOX);
  return data ? JSON.parse(data) : [];
}

// Save preferences to localStorage
function savePreferences(preferences) {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

// Load preferences from localStorage
function loadPreferences() {
  const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {};
}

// Save stages config to localStorage
function saveStagesConfig(config) {
  localStorage.setItem(STORAGE_KEYS.STAGES_CONFIG, JSON.stringify(config));
}

// Load stages config from localStorage
function loadStagesConfig() {
  const data = localStorage.getItem(STORAGE_KEYS.STAGES_CONFIG);
  return data ? JSON.parse(data) : null;
}

// Export all functions
export {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
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
