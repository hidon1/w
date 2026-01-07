// Firebase initialization (ESM imports from CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getMessaging, isSupported } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

const firebaseConfig = window.FIREBASE_CONFIG;
if (!firebaseConfig) throw new Error("Missing window.FIREBASE_CONFIG");

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
export const storage = getStorage(app);
export const auth = getAuth(app);

export let messaging = null;
(async () => {
  try {
    if (await isSupported()) {
      messaging = getMessaging(app);
    }
  } catch (e) {
    console.warn("Messaging not supported:", e);
  }
})();
