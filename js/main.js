import { saveReminder } from "./indexeddb.js";
import { isOnline, enqueue, setupOfflineHandlers } from "./offline.js";

// UUID generator with fallback for older browsers
function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for browsers without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const logEl = document.getElementById("log");
function log(msg) { if (logEl) logEl.textContent += `\n${msg}`; }

setupOfflineHandlers();

// Firebase and notifications removed
log("Running in offline-only mode");

// Camera/gallery input handling
const pickBtn = document.getElementById("pickBtn");
const fileInput = document.getElementById("cameraInput");
let selectedFile = null;

pickBtn.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => {
  selectedFile = e.target.files?.[0] || null;
  if (selectedFile) log("נבחרה תמונה: " + selectedFile.name);
});

// Save reminder with optional image
const saveBtn = document.getElementById("saveBtn");
const titleInput = document.getElementById("titleInput");
const dueInput = document.getElementById("dueInput");

saveBtn.addEventListener("click", async () => {
  try {
    // Image upload removed - Firebase storage no longer available
    const reminder = {
      id: generateUUID(),
      title: titleInput.value || "ללא כותרת",
      dueAt: new Date(dueInput.value).getTime() || Date.now(),
      createdAt: Date.now(),
    };
    await saveReminder(reminder);
    log("התזכורת נשמרה");
    // reset
    selectedFile = null; fileInput.value = ""; titleInput.value = ""; dueInput.value = "";
  } catch (e) {
    log("שגיאה בשמירה: " + e.message);
  }
});
