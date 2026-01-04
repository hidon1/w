// Firebase Messaging Service Worker
// This handles background push notifications when the app is closed
//
// Note: Firebase configuration is required in the service worker for FCM to work.
// This is the standard approach as per Firebase documentation.
// The API key has domain restrictions configured in Firebase Console.

importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyC8hWZ5XJGBQZx32m3VkL4JwPFe90qZAdQ",
    authDomain: "wine-d0c2c.firebaseapp.com",
    projectId: "wine-d0c2c",
    storageBucket: "wine-d0c2c.firebasestorage.app",
    messagingSenderId: "659709195708",
    appId: "1:659709195708:web:39b401c67d31206b4667b9",
    measurementId: "G-25Q2F6G9QC"
});

const messaging = firebase.messaging();

// Handle background messages (when app is closed)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || 'תזכורת';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/image_00b206.png',
        badge: '/image_00b206.png',
        tag: 'reminder-notification',
        requireInteraction: true, // Keep notification visible until user interacts
        vibrate: [200, 100, 200, 100, 200, 100, 200], // Long vibration pattern for Android
        data: payload.data || {},
        actions: [
            {
                action: 'dismiss',
                title: 'סגור'
            },
            {
                action: 'open',
                title: 'פתח אפליקציה'
            }
        ]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'dismiss') {
        // Just close the notification
        return;
    }
    
    // Open the app
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If the app is already open, focus it
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Handle push event for custom push messages
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received');
    
    if (event.data) {
        try {
            const data = event.data.json();
            console.log('[firebase-messaging-sw.js] Push data:', data);
            
            // If it's a reminder notification
            if (data.data && data.data.type === 'reminder') {
                const notificationOptions = {
                    body: data.data.text || data.notification?.body || '',
                    icon: '/image_00b206.png',
                    badge: '/image_00b206.png',
                    tag: 'reminder-' + (data.data.reminderId || Date.now()),
                    requireInteraction: true,
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    data: data.data,
                    actions: [
                        {
                            action: 'dismiss',
                            title: 'סגור'
                        },
                        {
                            action: 'open',
                            title: 'פתח אפליקציה'
                        }
                    ]
                };
                
                event.waitUntil(
                    self.registration.showNotification(
                        data.data.title || data.notification?.title || 'תזכורת',
                        notificationOptions
                    )
                );
            }
        } catch (error) {
            console.error('[firebase-messaging-sw.js] Error parsing push data:', error);
        }
    }
});
