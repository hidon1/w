# Reminders System with Image Upload and Push Notifications

## Overview

This implementation adds robust reminder functionality with image upload to Firebase Storage, offline support via IndexedDB, and push notifications even when the app is closed.

## Key Features Implemented

### 1. **Image Upload with Authentication**
- Anonymous Firebase authentication is automatically triggered when uploading images
- Images are stored in Firebase Storage at `reminders/{uid}/{timestamp}_{filename}`
- Offline detection prevents upload attempts without internet connection
- Clear error messages guide users when issues occur

### 2. **IndexedDB Storage (No QuotaExceeded Errors)**
- Reminders metadata is stored in IndexedDB instead of localStorage
- Prevents `QuotaExceededError` that occurred with large base64 images
- Automatic migration from localStorage to IndexedDB on first load
- Syncs between IndexedDB, localStorage (backup), and Firebase (cloud)

### 3. **Offline Support**
- Detects when device is offline using `navigator.onLine`
- Shows appropriate error messages when offline
- Reminders are saved locally even when offline
- Data syncs to Firebase when connection is restored

### 4. **Push Notifications**
- Service Worker registered for background notifications
- Firebase Cloud Messaging (FCM) integration
- Notifications appear even when app is closed
- Requires HTTPS and valid VAPID key configuration

### 5. **Modern Firestore Persistence**
- Uses `enablePersistence()` with `synchronizeTabs: true`
- Note: Full modular SDK migration not done to maintain backward compatibility
- Compat SDK continues to work but shows deprecation warning (harmless)

## Files Added/Modified

### New Files
- `/js/firebase-init.js` - Modular Firebase SDK initialization
- `/js/auth.js` - Authentication helpers
- `/js/indexeddb.js` - IndexedDB utilities
- `/js/offline.js` - Offline queue management
- `/js/image-upload.js` - Image upload to Storage
- `/js/notifications.js` - FCM push notifications
- `/js/main.js` - Standalone reminder app entry point
- `/firebase-messaging-sw.js` - Service Worker for background notifications
- `/reminders.html` - Standalone reminder page (alternative UI)
- `/test.html` - Test page for verifying functionality

### Modified Files
- `/index.html` - Main wine monitoring app with integrated reminders
  - Added IndexedDB helper functions
  - Updated `uploadReminderImage()` with authentication
  - Updated `addReminder()` to use IndexedDB
  - Updated `deleteReminder()` to use IndexedDB
  - Updated `loadRemindersFromFirebase()` to load from IndexedDB
  - Added Service Worker registration
  - Added FCM message handling

## Configuration Required

### 1. VAPID Key (Required for Push Notifications)

In `index.html` line ~24, replace:
```javascript
window.VAPID_PUBLIC_KEY = "REPLACE_ME_VAPID";
```

With your actual VAPID public key from Firebase Console:
1. Go to Firebase Console → Project Settings → Cloud Messaging
2. Under "Web Push certificates", generate a new key pair
3. Copy the "Key pair" value
4. Replace "REPLACE_ME_VAPID" with your key

### 2. Service Worker Firebase Config

In `firebase-messaging-sw.js`, the Firebase config is hardcoded (service workers can't access `window`):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC8hWZ5XJGBQZx32m3VkL4JwPFe90qZAdQ",
  // ... other config
};
```

This is already set to match your project. **No changes needed** unless you create a new Firebase project.

### 3. HTTPS Required

Camera access and push notifications **require HTTPS**. To test locally:
```bash
# Using Firebase Hosting (recommended)
firebase serve

# Or use any HTTPS local server
```

For production, deploy to Firebase Hosting:
```bash
firebase deploy
```

## Testing the Implementation

### Basic Test (test.html)

Visit `https://your-domain/test.html` to test:
1. IndexedDB read/write
2. Camera/gallery access
3. Service Worker registration
4. Online/offline detection

### Full Integration Test (index.html)

1. Open the reminders modal (sidebar → "תזכורות")
2. Click "צלם / בחר תמונה" - should open camera/gallery
3. Select an image
4. Fill in reminder details
5. Click "הוסף תזכורת"
6. Check browser console for:
   - "Anonymous sign-in successful" (if not logged in)
   - "Image uploaded successfully: https://..."
   - "Service Worker registered"
   - No QuotaExceededError

### Offline Test

1. Open DevTools → Network tab → Set to "Offline"
2. Try to add a reminder with an image
3. Should show error: "אין חיבור אינטרנט"
4. Add reminder without image - should save to IndexedDB
5. Go back online
6. Refresh - reminder should still be there

### Push Notifications Test

1. Ensure VAPID key is configured
2. Open the app over HTTPS
3. Grant notification permission when prompted
4. Check console for "FCM token: ..."
5. Send a test notification from Firebase Console
6. Close the browser tab
7. Notification should still appear

## Storage Rules (Firebase)

Ensure Firebase Storage rules allow authenticated users to upload:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reminders/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### "Not logged in - cannot upload image"
- **Fixed**: App now auto-signs in anonymously
- If still occurring, check Firebase Authentication is enabled

### "QuotaExceededError"
- **Fixed**: Images stored in Firebase Storage, only URLs in IndexedDB
- Old base64 images in localStorage are migrated automatically

### Service Worker not registering
- Check HTTPS is enabled
- Check `/firebase-messaging-sw.js` is accessible
- Check browser console for errors

### Camera not working
- Requires HTTPS (except localhost)
- Requires user permission
- Falls back to file picker if camera unavailable

### Push notifications not appearing
- Check VAPID key is correct
- Check notification permission granted
- Check service worker is active
- Must be HTTPS

## Architecture Decisions

### Why Hybrid SDK Approach?
The existing wine monitoring app uses Firebase compat SDK extensively. A full migration to modular SDK would risk breaking existing functionality. We added modular SDK alongside compat for new features while maintaining backward compatibility.

### Why IndexedDB instead of only Firestore?
1. Works offline without any Firebase connection
2. No quota limits like localStorage
3. Faster for local operations
4. Serves as reliable local cache
5. Syncs to Firestore for cloud backup

### Why Anonymous Auth?
Allows image uploads without forcing users to log in. Users can:
- Use the app offline completely
- Upload images with zero-friction auth
- Optionally sign in later for cross-device sync

## Future Enhancements

- [ ] Offline queue for delayed image uploads
- [ ] Image compression before upload
- [ ] Batch upload multiple images
- [ ] Scheduled notifications based on reminder time
- [ ] Rich notifications with image preview
- [ ] Delete images from Storage when reminder deleted
- [ ] Image thumbnail generation

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+ (iOS requires Add to Home Screen for PWA features)
- ✅ Samsung Internet 14+
- ⚠️ IE11 not supported (IndexedDB limitations)

## Notes

- The deprecation warning about `enablePersistence()` is expected with compat SDK
- To fully remove the warning, the entire app would need modular SDK migration
- Current implementation is production-ready despite the warning
- IndexedDB prevents the critical QuotaExceededError issue
