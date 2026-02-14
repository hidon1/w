# Firestore Security Rules for Wine Monitoring System

## Overview
These security rules ensure that users can only access their own data and that all access requires authentication.

## Database Structure

The Firestore database is organized as follows:

```
/accounts/{userId}/
  - email (string)
  - createdAt (timestamp)
  - updatedAt (timestamp)
  
  /data/
    - projects (document)
      * projects (object)
      * stagesConfig (object)
      * updatedAt (timestamp)
    
    - reminders (document)
      * reminders (array)
      * updatedAt (timestamp)
    
    - inbox (document)
      * inbox (array)
      * updatedAt (timestamp)
    
    - preferences (document)
      * preferences (object)
        - darkMode (string)
        - currentProjectId (string)
        - currentStageId (string)
      * updatedAt (timestamp)
  
  /permissions/{email}/
    - allowEdit (boolean)
    - allowFinance (boolean)
    - allowedProjectId (string or null)
    - createdAt (timestamp)
```

## Security Rules

Copy and paste these rules into your Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `hidon1-e4c91`
3. Navigate to Firestore Database
4. Click on the "Rules" tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users can read and write only their own account data
    match /accounts/{userId} {
      allow read, write: if isOwner(userId);
      
      // Users can read and write their own data subcollection
      match /data/{document=**} {
        allow read, write: if isOwner(userId);
      }
      
      // Users can manage permissions they grant to others
      match /permissions/{email} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Testing the Rules

After applying the rules, test them in the Firebase Console:

### Test Case 1: Authenticated User Reading Their Own Data
```
Location: /accounts/USER_ID/data/projects
Auth: Authenticated as USER_ID
Expected: ✅ Allow
```

### Test Case 2: Authenticated User Reading Another User's Data
```
Location: /accounts/OTHER_USER_ID/data/projects
Auth: Authenticated as USER_ID
Expected: ❌ Deny
```

### Test Case 3: Unauthenticated User Reading Any Data
```
Location: /accounts/USER_ID/data/projects
Auth: Unauthenticated
Expected: ❌ Deny
```

## Data Privacy and Security

These rules ensure:

1. **Authentication Required**: Only authenticated users can access Firestore
2. **User Isolation**: Each user can only access their own data
3. **No Public Access**: All unauthenticated requests are denied
4. **Shared Access**: Permission system allows users to grant access to specific data

## Implementing Shared Access

The permission system allows users to share access to their data:

1. Owner creates a permission document under `/accounts/{ownerId}/permissions/{guestEmail}`
2. Guest user can query permissions granted to their email
3. Guest user uses the owner's UID to access shared data

Note: The current security rules allow the owner full control over their permissions subcollection. For production, you may want to add more granular rules based on your sharing requirements.

## Maintenance

- Review and update security rules regularly
- Monitor Firebase Console for any security alerts
- Test rules thoroughly before deploying to production
- Keep rules in sync with your application's data structure

## Support

For more information on Firestore Security Rules, visit:
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Language Reference](https://firebase.google.com/docs/rules/rules-language)
