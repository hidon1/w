import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

let currentUser = auth.currentUser;

export async function ensureAuth() {
  if (auth.currentUser) {
    currentUser = auth.currentUser;
    return currentUser;
  }
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        unsub();
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          currentUser = cred.user;
          unsub();
          resolve(cred.user);
        } catch (e) {
          unsub();
          reject(e);
        }
      }
    });
  });
}

export function getCurrentUser() {
  return currentUser || auth.currentUser;
}
