# Firebase Authentication and Firestore Integration

## Overview

This application now includes full Firebase Authentication and Firestore Database integration. Users can sign in with Google or email/password, and their data is automatically synchronized to the cloud.

## Features Implemented

### 1. Firebase Authentication

- **Google Sign-In**: One-click authentication using Google accounts
- **Email/Password Authentication**: Traditional email and password registration and login
- **Automatic Login Modal**: First-time visitors automatically see the login modal
- **Session Persistence**: Users remain logged in across browser sessions

### 2. Data Synchronization

All application data is synchronized between:
- **localStorage** (for offline access and backup)
- **IndexedDB** (for large data like images)
- **Firestore** (for cloud storage and cross-device sync)

Synchronized data includes:
- **Projects**: All wine monitoring projects and their data
- **Reminders**: User reminders with images and notifications
- **Inbox**: Notification inbox items
- **Preferences**: User settings like dark mode, current project, etc.
- **Stages Configuration**: Custom stage configurations

### 3. User Experience

#### First Visit
1. User visits the website
2. Login modal automatically appears
3. User can:
   - Sign in with Google
   - Register with email/password
   - Log in with existing email/password
   - Skip login (work locally only)

#### After Login
1. User's data is loaded from Firestore
2. All changes are automatically saved to both localStorage and Firestore
3. Data syncs across all devices where the user is logged in

#### Returning Visit
1. User is automatically logged in (if previously authenticated)
2. Data is loaded from Firestore
3. Seamless experience continues

## Technical Implementation

### Firebase Configuration

The Firebase project configuration is stored in `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABKn0GfHYi_1UG_0sfSn68CNNz4Q9nS7g",
  authDomain: "hidon1-e4c91.firebaseapp.com",
  databaseURL: "https://hidon1-e4c91-default-rtdb.firebaseio.com",
  projectId: "hidon1-e4c91",
  storageBucket: "hidon1-e4c91.firebasestorage.app",
  messagingSenderId: "411517496015",
  appId: "1:411517496015:web:2d9c176783d062110465ba",
  measurementId: "G-FWTSZNY72T"
};
```

### Data Structure in Firestore

```
accounts/
  {userId}/
    - email: string
    - createdAt: timestamp
    - updatedAt: timestamp
    
    data/
      projects/
        - projects: object
        - stagesConfig: object
        - updatedAt: timestamp
      
      reminders/
        - reminders: array
        - updatedAt: timestamp
      
      inbox/
        - inbox: array
        - updatedAt: timestamp
      
      preferences/
        - preferences: object
          * darkMode: string
          * currentProjectId: string
          * currentStageId: string
        - updatedAt: timestamp
    
    permissions/
      {email}/
        - allowEdit: boolean
        - allowFinance: boolean
        - allowedProjectId: string
        - createdAt: timestamp
```

### Key Functions

#### Authentication
- `initFirebase()`: Initializes Firebase SDK
- `signInWithGoogle()`: Handles Google authentication
- `signInWithEmail()`: Handles email/password login
- `registerWithEmail()`: Creates new user accounts
- `signOutUser()`: Signs out the current user
- `handleAuthStateChanged()`: Manages user state changes

#### Data Synchronization
- `saveProjectsToCloud()`: Syncs projects to Firestore
- `loadProjectsFromCloud()`: Loads projects from Firestore
- `saveRemindersToCloud()`: Syncs reminders to Firestore
- `loadRemindersFromCloud()`: Loads reminders from Firestore
- `saveInboxToCloud()`: Syncs inbox to Firestore
- `loadInboxFromCloud()`: Loads inbox from Firestore
- `savePreferencesToCloud()`: Syncs preferences to Firestore
- `loadPreferencesFromCloud()`: Loads preferences from Firestore

### Automatic Sync Points

The application automatically syncs to Firestore when:
1. Projects are created, modified, or deleted
2. Reminders are added or removed
3. Inbox items change
4. User preferences are updated (e.g., dark mode toggle)
5. Any project data is modified

### Debounced Saves

To optimize Firestore usage and reduce costs:
- Project saves are debounced by 1500ms
- Only the final change in a series is saved
- Prevents excessive writes during rapid edits

## Security

### Firestore Security Rules

The application uses strict security rules ensuring:
- Users can only access their own data
- All access requires authentication
- No public data access

See `FIRESTORE_SECURITY_RULES.md` for the complete rules.

### Data Privacy

- User data is isolated per user ID
- No cross-user data access without explicit permissions
- Email addresses are normalized to prevent duplicates

## Offline Support

The application works offline by:
1. Storing data in localStorage and IndexedDB
2. Checking for network connectivity before Firestore operations
3. Gracefully handling sync failures
4. Maintaining local data even when offline

## Shared Access (Advanced Feature)

Users can grant access to their data to other users:
- Read-only access
- Edit access
- Finance access
- Project-specific access

This enables collaboration while maintaining security.

## Setup Instructions for Developers

1. **Firebase Project**: The app is already connected to the `hidon1-e4c91` project
2. **Security Rules**: Apply the rules from `FIRESTORE_SECURITY_RULES.md`
3. **Testing**: Use the Firebase Console to monitor authentication and data

## Troubleshooting

### Login Modal Not Showing
- Check browser console for Firebase initialization errors
- Verify `firebase-config.js` is loading correctly
- Check if `skipLogin` is set in localStorage

### Data Not Syncing
- Verify user is authenticated (check auth status in UI)
- Check browser console for Firestore errors
- Verify Firestore security rules are applied correctly

### Google Sign-In Issues
- Ensure domain is authorized in Firebase Console
- Check for popup blockers
- App will automatically retry with redirect if popup is blocked

## Performance Considerations

- **Lazy Loading**: Large data (like images) stored in IndexedDB
- **Debounced Writes**: Prevents excessive Firestore writes
- **Selective Sync**: Only changed data is synchronized
- **Local-First**: UI updates immediately, sync happens in background

## Future Enhancements

Potential improvements:
- Real-time sync using Firestore listeners
- Conflict resolution for multi-device edits
- Batch operations for better performance
- Progressive Web App (PWA) capabilities
- Cloud Functions for complex operations

## Support

For Firebase-related issues:
- [Firebase Console](https://console.firebase.google.com/project/hidon1-e4c91)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
