# Firebase Deployment Guide - Error Fixes

This guide helps you deploy the Firebase fixes that address authentication and permission errors.

## Prerequisites

Before deploying, ensure you have:

1. **Firebase CLI installed**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Logged in to Firebase**:
   ```bash
   firebase login
   ```

3. **Project initialized** (if not already):
   ```bash
   firebase init
   ```
   - Select your Firebase project
   - Choose Firestore and Hosting

## What Was Fixed

### 1. Firestore Security Rules
**Issue**: Users couldn't query the `userAccess` collection to check their own permissions.

**Fix**: Added read permission for users to see their own access grants:
```javascript
allow read: if isAuthenticated() && request.auth.email == resource.data.userEmail;
```

### 2. Firestore Indexes
**Issue**: Missing composite index for querying `userAccess` by `userEmail` and `status`.

**Fix**: Added new index in `firestore.indexes.json`:
```json
{
  "fields": [
    { "fieldPath": "userEmail", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```

### 3. Authentication Flow
**Issue**: "No user from redirect" message appeared even in normal cases.

**Fix**: Removed unnecessary console log for normal redirect flow.

### 4. Error Handling
**Issues**: 
- Generic error messages didn't help users understand problems
- Permission errors caused alerts even when expected
- No fallback to localStorage when Firebase fails

**Fixes**:
- Added specific error code handling (permission-denied, failed-precondition, etc.)
- Graceful degradation to localStorage
- User-friendly error messages
- Detailed console logging for debugging

## Deployment Steps

### Step 1: Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

**Expected output**:
```
✔  Deploy complete!
```

### Step 2: Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

**Expected output**:
```
✔  Deploy complete!
```

**Note**: Index creation can take several minutes. Firebase will show the progress in the console.

### Step 3: Deploy Hosting (Web App)

```bash
firebase deploy --only hosting
```

**Expected output**:
```
✔  Deploy complete!
Project Console: https://console.firebase.google.com/project/wine-d0c2c/overview
Hosting URL: https://wine-d0c2c.web.app
```

### Step 4: Deploy Everything (Alternative)

If you want to deploy everything at once:

```bash
firebase deploy
```

## Verification

### Test 1: Authentication Flow
1. Open the app in a browser
2. Sign in with Google
3. **Expected**: No "No user from redirect" error in console
4. **Expected**: User should be signed in successfully

### Test 2: Permission Checking
1. While signed in, check browser console
2. **Expected**: No "permission-denied" errors for normal users
3. **Expected**: If user has no shared access, see "No shared access found for user" (informational)

### Test 3: Access Management
1. Sign in as account owner
2. Open Access Management (ניהול גישה)
3. Try to grant access to a user
4. **Expected**: Access granted successfully
5. **Expected**: User appears in active users list

### Test 4: User Access Query
1. Sign in as a user who was granted access
2. **Expected**: App loads shared data automatically
3. **Expected**: Access notice shows at top of page
4. **Expected**: No permission errors in console

### Test 5: Offline Mode
1. Disconnect from internet
2. Use the app
3. **Expected**: App works with localStorage
4. **Expected**: Message "Not logged in – saving to localStorage only" in console

## Troubleshooting

### Problem: "Permission Denied" on userAccess query

**Possible Causes**:
- Security rules not deployed
- Index not created yet

**Solutions**:
1. Re-deploy security rules: `firebase deploy --only firestore:rules`
2. Wait for index creation (check Firebase Console > Firestore > Indexes)
3. Verify rules in Firebase Console match the new rules

### Problem: "Index Required" Error

**Possible Causes**:
- Indexes not deployed
- Index creation still in progress

**Solutions**:
1. Deploy indexes: `firebase deploy --only firestore:indexes`
2. Check Firebase Console > Firestore > Indexes for status
3. Wait for index to finish building (can take 5-10 minutes)

### Problem: Users Can't See Shared Data

**Possible Causes**:
- User email doesn't match granted email exactly
- Access status is not "active"
- Security rules not allowing read

**Solutions**:
1. Check Firestore Console > userAccess collection
2. Verify user email matches exactly (case-sensitive)
3. Verify status field is "active"
4. Re-deploy security rules

### Problem: Changes Not Visible

**Possible Causes**:
- Browser cache
- Old version of app loaded

**Solutions**:
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Open in incognito/private window

## Monitoring

### Check Deployment Status

```bash
firebase deploy --only firestore:indexes --debug
```

### View Firebase Console

1. **Firestore Rules**: https://console.firebase.google.com/project/wine-d0c2c/firestore/rules
2. **Firestore Indexes**: https://console.firebase.google.com/project/wine-d0c2c/firestore/indexes
3. **Authentication**: https://console.firebase.google.com/project/wine-d0c2c/authentication/users

### Check Console Logs

Open browser Developer Tools (F12) and check Console tab for:
- ✅ "State saved successfully to cloud and localStorage"
- ✅ "No saved state for user – using localStorage"
- ❌ Any red error messages

## Security Notes

### What These Rules Allow

1. **Own Data**: Users can always read/write their own data
2. **Access Grants**: Users can read their own access grants
3. **Shared Data**: Users with active access can read owner's data
4. **Editing**: Only users with `allowEdit: true` can modify shared data
5. **Management**: Only account owners can grant/revoke access

### What These Rules Prevent

1. ❌ Reading other users' data without permission
2. ❌ Modifying data without edit permission
3. ❌ Creating access grants for other accounts
4. ❌ Revoking access not owned by current user

## Post-Deployment Checklist

- [ ] Security rules deployed successfully
- [ ] Indexes created and built
- [ ] Web app deployed to hosting
- [ ] Authentication works without errors
- [ ] Users can grant access without permission errors
- [ ] Active users list loads correctly
- [ ] Shared data accessible to granted users
- [ ] No console errors for normal operations
- [ ] Offline mode falls back to localStorage
- [ ] Error messages are user-friendly

## Rollback (If Needed)

If deployment causes issues, you can rollback:

```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:channel:deploy <channel-id>
```

Or restore previous rules from Firebase Console.

## Support

If issues persist after deployment:

1. Check Firebase Console for specific error messages
2. Review browser console for detailed errors
3. Verify all indexes are "Enabled" status
4. Ensure Firebase CLI version is up to date: `npm update -g firebase-tools`
5. Test in incognito mode to rule out cache issues

## References

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
