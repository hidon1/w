import { messaging } from "./firebase-init.js";
import { getToken } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js";

export async function initNotifications() {
  if (!messaging) return null;
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("לא ניתנה הרשאה להתראות");
  const vapidKey = window.VAPID_PUBLIC_KEY;
  if (!vapidKey) throw new Error("חסר VAPID_PUBLIC_KEY");
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: await navigator.serviceWorker.ready });
  console.log("FCM token:", token);
  return token;
}
