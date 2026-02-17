# Firestore Security Rules for Wine Monitoring System

These rules are compatible with the current data structure used by the app:

- `/accounts/{userId}` (account profile)
- `/accounts/{userId}/data/{documentId}` where `documentId` is one of:
  - `projects`
  - `reminders`
  - `inbox`
  - `preferences`
- `/accounts/{userId}/permissions/{collaboratorUid}`
- `/accounts/{userId}/sharedWith/{ownerUid}`

## Why permissions looked "saved" but didn't actually work

In the app flow, the account owner writes two docs when granting access:

1. `accounts/{ownerUid}/permissions/{collaboratorUid}`
2. `accounts/{collaboratorUid}/sharedWith/{ownerUid}`

With the old rule `allow read, write: if isSelf(uid);` on `sharedWith`, step 2 is denied (because the owner is **not** `isSelf(collaboratorUid)`).
So the UI can still show an item under the owner's list, but the collaborator cannot see/use the shared account reliably.

## Recommended Rules (matching current permission-sharing logic)

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

    function isCollaborator(collaboratorUid) {
      return isSignedIn() && request.auth.uid == collaboratorUid;
    }

    function isOwnerUid(ownerUid) {
      return isSignedIn() && request.auth.uid == ownerUid;
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

      // owner -> collaborator permission documents
      match /permissions/{collaboratorUid} {
        // owner can always read/write; collaborator can read their own permission doc
        allow read: if isOwner(userId) || isCollaborator(collaboratorUid);
        allow write: if isOwner(userId);
      }

      // mirrored list shown under collaborator account
      match /sharedWith/{ownerUid} {
        // collaborator can read their shared accounts list
        allow read: if isOwner(userId);

        // write/delete allowed to:
        // - collaborator themself
        // - owner that is granting/revoking access
        allow create, update, delete: if isOwner(userId) || isOwnerUid(ownerUid);
      }
    }

    // Email index for collaborator lookup by email
    match /usersByEmail/{emailKey} {
      allow read: if isSignedIn();
      allow create, update: if isSignedIn()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.email is string
        && request.resource.data.email.size() > 3;
      allow delete: if false;
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

- Signed in as owner UID → can write `/accounts/{ownerUid}/permissions/{collaboratorUid}` ✅
- Signed in as owner UID → can write `/accounts/{collaboratorUid}/sharedWith/{ownerUid}` ✅
- Signed in as collaborator UID → can read `/accounts/{collaboratorUid}/sharedWith/*` ✅
- Signed in as collaborator UID → can read `/accounts/{ownerUid}/permissions/{collaboratorUid}` ✅
- Unauthenticated → any read/write ❌
