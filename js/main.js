import { ensureAuth } from "./auth.js";
import { saveReminder } from "./indexeddb.js";
import { isOnline, enqueue, setupOfflineHandlers } from "./offline.js";
import { uploadReminderImage } from "./image-upload.js";
import { initNotifications } from "./notifications.js";

const logEl = document.getElementById("log");
function log(msg) { logEl.textContent += `\n${msg}`; }

setupOfflineHandlers();

// Register SW for messaging
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js").then(() => log("Service worker registered"));
}

// Init notifications (best-effort)
initNotifications().catch((e) => log("Notifications init error: " + e.message));

// Auth before actions
ensureAuth().then(() => log("Authenticated (anonymous)")).catch((e) => log("Auth error: " + e.message));

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
    await ensureAuth();
    let imageUrl;
    const doUpload = async () => {
      if (selectedFile) imageUrl = await uploadReminderImage(selectedFile);
    };
    if (isOnline()) {
      await doUpload();
    } else if (selectedFile) {
      enqueue(doUpload);
      log("אופליין — ההעלאה תתבצע כשיהיה חיבור");
    }

    const reminder = {
      id: crypto.randomUUID(),
      title: titleInput.value || "ללא כותרת",
      dueAt: new Date(dueInput.value).getTime() || Date.now(),
      imageUrl,
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
