/* Service worker to show notifications in background */
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// Firebase config - must be hardcoded in service worker (no access to window)
// IMPORTANT: Update these values to match your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyC8hWZ5XJGBQZx32m3VkL4JwPFe90qZAdQ",
  authDomain: "wine-d0c2c.firebaseapp.com",
  projectId: "wine-d0c2c",
  storageBucket: "wine-d0c2c.firebasestorage.app",
  messagingSenderId: "659709195708",
  appId: "1:659709195708:web:39b401c67d31206b4667b9",
  measurementId: "G-25Q2F6G9QC"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  const data = payload.data || {};
  self.registration.showNotification(title || "תזכורת", {
    body: body || "",
    icon: icon || "/icons/icon-192.png",
    data,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(self.clients.openWindow(url));
});
