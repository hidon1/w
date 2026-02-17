# Firestore Security Rules for Wine Monitoring System

These rules are compatible with the current data structure used by the app:

- `/accounts/{userId}` (account profile)
- `/accounts/{userId}/data/{documentId}` where `documentId` is one of:
  - `projects`
  - `reminders`
  - `inbox`
  - `preferences`
- `/accounts/{userId}/permissions/{email}`

## Recommended Rules (Production-safe baseline)

Paste these rules in **Firebase Console → Firestore Database → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function validAccountCreate(userId) {
      return request.resource.data.keys().hasOnly(['email', 'createdAt', 'updatedAt'])
        && request.resource.data.email is string
        && request.resource.data.createdAt is timestamp
        && request.resource.data.updatedAt is timestamp
        && request.auth.uid == userId;
    }

    function validAccountUpdate() {
      return request.resource.data.keys().hasOnly(['email', 'createdAt', 'updatedAt'])
        && request.resource.data.email is string
        && request.resource.data.createdAt is timestamp
        && request.resource.data.updatedAt is timestamp;
    }

    function validDataDocId(docId) {
      return docId in ['projects', 'reminders', 'inbox', 'preferences'];
    }

    match /accounts/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId) && validAccountCreate(userId);
      allow update: if isOwner(userId) && validAccountUpdate();
      allow delete: if false;

      match /data/{docId} {
        allow read, write: if isOwner(userId) && validDataDocId(docId);
      }

      match /permissions/{email} {
        allow read, write: if isOwner(userId);
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Firebase Console checks to avoid Google login failures

1. **Authentication → Sign-in method → Google** is enabled.
2. **Authentication → Settings → Authorized domains** includes every domain you use:
   - `localhost`
   - your production domain
   - any in-app browser/webview redirect domain you actually use
3. OAuth consent screen is configured in Google Cloud (if required for your project type).
4. If login is from Android WebView/iOS WKWebView, prefer `signInWithRedirect` flow.

## Quick test matrix

- Signed in as owner UID → read/write `/accounts/{uid}` and `/accounts/{uid}/data/*` ✅
- Signed in as another UID → access `/accounts/{uid}` ❌
- Unauthenticated → any read/write ❌
