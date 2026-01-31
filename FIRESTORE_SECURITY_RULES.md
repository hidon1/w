# Firestore Security Rules

## Required Security Rules for Firebase Project

To fix the "Missing or insufficient permissions" errors, you need to configure the Firestore security rules in your Firebase console.

### Steps to Update Security Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nitur-wine`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow authenticated users to read and write their own user data
    match /userData/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/accounts/$(userId)).data.members.hasAny([request.auth.token.email]));
    }
    
    // Allow authenticated users to manage accounts they are members of
    match /accounts/{accountId} {
      allow read: if request.auth != null && 
        request.auth.token.email in resource.data.members;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerUid || 
         request.auth.token.email in resource.data.members);
      allow create: if request.auth != null;
    }
    
    // Allow authenticated users to read and write messages in accounts they are members of
    match /accounts/{accountId}/messages/{messageId} {
      allow read: if request.auth != null && 
        request.auth.token.email in get(/databases/$(database)/documents/accounts/$(accountId)).data.members;
      allow write: if request.auth != null && 
        request.auth.token.email in get(/databases/$(database)/documents/accounts/$(accountId)).data.members;
    }
    
    // Allow authenticated users to manage access records
    match /access/{accessId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### What These Rules Do:

1. **userData collection**: Users can read/write their own data or data from accounts they're members of
2. **accounts collection**: Users can read/write accounts they are members of
3. **messages subcollection**: Users can read/write messages in accounts they're members of
4. **access collection**: Authenticated users can manage access records

### Testing the Rules:

After applying these rules:
1. Sign in to the application
2. Try creating a new project
3. Check the browser console - you should no longer see permission errors
4. Verify data is being saved to Firestore

### Common Issues:

- **Still seeing permission errors?** Make sure you're signed in with Google
- **Rules not working?** Double-check the rules are published in Firebase console
- **Network errors?** Check your internet connection and Firebase project status

## Additional Configuration

### Enable Google Authentication:

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Add your domain to the **Authorized domains** list

### Network Connectivity:

The application now includes:
- Automatic retry logic for network failures (up to 3 attempts)
- Exponential backoff for retries
- Clear error messages for different error types
- Fallback to local storage when Firestore is unavailable

## Support

If you continue to experience issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project configuration
3. Ensure your internet connection is stable
4. Try signing out and signing in again
