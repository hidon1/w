import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { storage } from "./firebase-init.js";
import { getCurrentUser } from "./auth.js";

export async function uploadReminderImage(file) {
  if (!navigator.onLine) throw new Error("אין חיבור אינטרנט כרגע");
  const user = getCurrentUser();
  if (!user) throw new Error("אין משתמש מחובר");
  const path = `reminders/${user.uid}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type });
  return await getDownloadURL(snapshot.ref);
}
