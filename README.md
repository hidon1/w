# Wine Monitoring System - Access Management Update

## Overview

This update introduces a streamlined access management system that replaces the invite-link-based approach with direct user management capabilities.

## What Changed

### Before
- Managers created invite links with permissions
- Links had to be shared manually via email
- Users accessed data through URL parameters
- No centralized user management interface

### After
- Managers directly add users by email address
- Permissions assigned through intuitive UI
- Users automatically get access on login
- Real-time user management dashboard
- Revoke access with one click

## Key Features

### 1. **Streamlined UI**
   - Clean, modern interface with clear sections
   - Icon-based visual cues for quick understanding
   - Mobile-responsive design
   - Color-coded permission badges

### 2. **Direct Email Input**
   - Enter user email addresses manually
   - Email validation built-in
   - No external email system required
   - Instant access granting

### 3. **Granular Permissions**
   - **View Only**: Read-only access to project data
   - **Edit**: Full edit capabilities
   - **Finance Access**: Separate control for financial data
   - **Project Scope**: Grant access to all or specific projects

### 4. **User Management Dashboard**
   - See all users with active access at a glance
   - Visual permission indicators
   - Quick edit and revoke actions
   - Real-time updates

## Usage Instructions

### For Account Managers

#### Granting Access
1. Open the sidebar (hamburger menu)
2. Click "ניהול גישה" (Access Management)
3. Enter the user's email address
4. Select project scope (all projects or specific)
5. Choose permission level:
   - View Only (default) - read-only access
   - Edit - can modify data
6. Optionally enable Finance Access
7. Click "הענק גישה" (Grant Access)

#### Managing Users
- View all active users in the "Active Users" section
- Each user shows:
  - Email address
  - Permission level (View/Edit)
  - Project scope
  - Finance access status
- Click the delete icon to revoke access
- Changes take effect immediately

### For Users with Granted Access

1. **Login**: Sign in with your Google account or email/password
2. **Automatic Access**: The system automatically checks if you have been granted access
3. **View Permissions**: A notice at the top shows your access level
4. **Restrictions**: 
   - View-only users cannot edit data
   - Edit permission required to modify projects
   - Finance access needed to see financial reports

## Technical Details

### New Firestore Collections

#### `userAccess`
Replaces the old `projectAccessInvites` system:
```javascript
{
  ownerUid: "account-manager-uid",
  ownerEmail: "manager@example.com",
  userEmail: "user@example.com",
  projectId: null,  // or specific project ID
  allowEdit: true,
  allowFinance: false,
  status: "active",  // or "revoked"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Security Rules

New Firestore rules ensure:
- Only account owners can manage access to their data
- Users can only see data they've been granted access to
- Edit permissions are enforced at the database level
- Finance data respects access flags

### Backward Compatibility

- Old invite system still works
- Existing shared access continues functioning
- No breaking changes to current users
- Gradual migration supported

## Firebase Deployment

## Google Sign-In Setup

This application uses Google Identity Services (GIS) for authentication with account picker functionality. This provides a modern, streamlined sign-in experience on both mobile and desktop devices.

### Features

- **Account Picker**: Displays all Google accounts signed in on the device
- **Mobile-Optimized**: Works seamlessly on Android and iOS devices
- **One-Click Sign-In**: Users can quickly select and sign in with any of their accounts
- **Secure**: Uses OAuth 2.0 with ID tokens that can be verified server-side

### Setting Up Google OAuth Client ID

To enable Google Sign-In, you need to create an OAuth 2.0 Client ID in Google Cloud Console:

#### 1. Create OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Give it a name (e.g., "Wine Monitoring System - Web Client")

#### 2. Configure Authorized Origins

Add your domain(s) to the **Authorized JavaScript origins**:

- For local development: `http://localhost`
- For production: `https://your-domain.com`
- For Firebase Hosting: `https://your-project.firebaseapp.com` and `https://your-project.web.app`

**Important**: You must use HTTPS for production. HTTP is only allowed for `localhost`.

#### 3. Configure Redirect URIs (Optional)

If using redirect-based flows, add to **Authorized redirect URIs**:

- `https://your-domain.com/callback`
- Note: The GIS account picker doesn't require redirect URIs

#### 4. Update Client ID in Code

After creating the OAuth Client ID, copy it and replace the placeholder in `index.html`:

```html
<!-- Find this line in index.html -->
<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID.apps.googleusercontent.com"
     ...
```

Replace `YOUR_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID.

### Mobile Compatibility Notes

#### Android (Chrome)

- **Best Experience**: When Chrome is signed in to a Google account, the account picker will display all signed-in accounts
- **One-Click Sign-In**: Users can select their account and sign in immediately
- **Requirements**: 
  - HTTPS required (except localhost)
  - Domain must be in Authorized JavaScript origins

#### iOS (Safari)

- **ITP Support**: The `itp_support="true"` parameter enables Intelligent Tracking Prevention compatibility
- **User Interaction Required**: Safari may require a user tap/click before showing the account picker
- **Cookie Requirements**: Third-party cookies must be enabled for Google sign-in
- **HTTPS Required**: Must be served over HTTPS (except localhost)

#### Cross-Platform Tips

1. **HTTPS is Mandatory**: Always use HTTPS in production (Firebase Hosting provides this automatically)
2. **Domain Whitelisting**: Ensure your domain is added to Authorized JavaScript origins
3. **Testing**: Test on actual devices, not just emulators
4. **Account Picker**: May not show if only one account is signed in (auto-selects)

### WebView in Native Apps

If you plan to embed this in a native iOS/Android app using WebView:

#### Not Recommended Approach
- Google discourages OAuth in embedded WebViews for security reasons
- Many features may not work properly in WebViews

#### Recommended Approaches

**For Android:**
- Use [Chrome Custom Tabs](https://developer.chrome.com/docs/android/custom-tabs/)
- Or use [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/) SDK

**For iOS:**
- Use [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller)
- Or use [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios/) SDK

**Best Practice:**
For native apps, use the platform-specific Google Sign-In SDKs and authenticate natively, then share the ID token with your web app if needed.

### Server-Side Verification (Future Implementation)

Currently, the ID token is used client-side with Firebase Authentication. For production deployments with custom backends:

1. **Send ID Token to Backend**: The `handleGoogleSignIn` callback receives an ID token
2. **Verify Token Server-Side**: Use Google's token verification libraries
3. **Create Session**: After verification, create a server-side session

Example backend verification (Node.js):

```javascript
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // Use userid to create session
}
```

### Troubleshooting

#### "Invalid Client" Error
- Verify your Client ID is correct in `index.html`
- Ensure the Client ID matches the one from Google Cloud Console

#### Account Picker Not Showing
- **Check Domain**: Ensure your domain is in Authorized JavaScript origins
- **Check HTTPS**: Must use HTTPS (except localhost)
- **Clear Cache**: Try clearing browser cache and cookies
- **iOS Safari**: Tap the button to trigger the picker

#### "Not a valid origin for the client"
- Add your domain to Authorized JavaScript origins in Google Cloud Console
- Include the protocol: `https://` (not just the domain name)
- Wait a few minutes for changes to propagate

#### Works on Desktop but Not Mobile
- Verify HTTPS is being used
- Check that cookies are enabled
- Test in Chrome (Android) and Safari (iOS) specifically
- Ensure domain is whitelisted in Google Cloud Console

### Security Best Practices

1. **Never Commit Client ID to Public Repos**: While Client IDs are not secret, it's best practice to use environment variables
2. **Verify Tokens Server-Side**: Always verify ID tokens on your backend before trusting them
3. **Use HTTPS**: Required for production, prevents token interception
4. **Limit Authorized Origins**: Only add domains you control
5. **Monitor Usage**: Check Google Cloud Console for suspicious activity

### Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Account Chooser Flow](https://developers.google.com/identity/gsi/web/guides/offerings)
- [Token Verification](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token)
- [Mobile Best Practices](https://developers.google.com/identity/gsi/web/guides/devices)

## Firebase Deployment

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in to Firebase: `firebase login`
- Project initialized: `firebase init`

### Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### Deploy Indexes
```bash
firebase deploy --only firestore:indexes
```

### Deploy Everything
```bash
firebase deploy
```

## Configuration Files

### `firebase.json`
Main Firebase configuration

### `firestore.rules`
Security rules for Firestore database

### `firestore.indexes.json`
Database indexes for efficient queries

### `ACCESS_MANAGEMENT.md`
Detailed documentation of the access management system

### `DEPLOYMENT_GUIDE.md`
Step-by-step guide for deploying Firebase fixes and troubleshooting

### `TESTING_GUIDE.md`
Comprehensive test cases to validate Firebase functionality

## Migration Guide

### For Existing Systems

1. **Deploy Security Rules**: Run `firebase deploy --only firestore:rules`
2. **Create Indexes**: Firebase will prompt to create required indexes
3. **Test with New User**: Grant access to a test account
4. **Verify Permissions**: Ensure view/edit restrictions work
5. **Migrate Existing Invites** (optional): Convert old invites to direct access

### No Immediate Action Required

The old system continues working alongside the new system. You can:
- Keep using old invite links
- Start using new direct access
- Gradually migrate users
- Eventually deprecate invites

## Troubleshooting

### Recent Firebase Error Fixes (v2.1)

The following Firebase errors have been resolved in version 2.1:

#### 1. "Permission Denied" on userAccess Query
**Fixed**: Users can now query their own access grants
- Security rule added: `allow read: if isAuthenticated() && request.auth.email == resource.data.userEmail`
- This allows users to check if they have been granted access

#### 2. "Missing Index" Error
**Fixed**: Added composite index for userAccess collection
- Index fields: `userEmail` (ascending), `status` (ascending)
- Deploy with: `firebase deploy --only firestore:indexes`

#### 3. "No user from redirect" Console Message
**Fixed**: Removed misleading console log
- This was showing for normal cases when no redirect occurred
- Now silent for normal authentication flows

#### 4. Generic Error Messages
**Fixed**: Specific error handling for common scenarios
- `permission-denied`: Suggests checking Firestore rules
- `failed-precondition`: Indicates missing index
- `not-found`: Indicates missing document
- All errors now have helpful user-facing messages

#### 5. Offline Mode Issues
**Fixed**: App now gracefully falls back to localStorage
- Works offline without errors
- Data syncs to Firebase when connection restored
- No disruption to user experience

### "Permission Denied" Errors

**Problem**: User gets permission errors when accessing data

**Solutions**:
1. Verify security rules are deployed: `firebase deploy --only firestore:rules`
2. Check user email exactly matches granted email
3. Ensure access status is "active" in Firestore
4. Verify required indexes are created
5. See `DEPLOYMENT_GUIDE.md` for detailed instructions

### User Access Not Showing

**Problem**: User can't see shared data after being granted access

**Solutions**:
1. Have user log out and log back in
2. Check Firestore for the access record
3. Verify ownerUid matches account manager's UID
4. Ensure user's email is correct

### Changes Not Saving

**Problem**: Edits to permissions don't persist

**Solutions**:
1. Check browser console for errors
2. Verify Firebase connection
3. Ensure security rules allow updates
4. Check for network issues

## Support and Maintenance

### Regular Tasks

- **Review Active Users**: Periodically check who has access
- **Audit Permissions**: Ensure users have appropriate levels
- **Revoke Unused Access**: Remove access for inactive users
- **Monitor Firestore Usage**: Watch for quota limits

### Best Practices

1. **Principle of Least Privilege**: Grant minimum required permissions
2. **Regular Reviews**: Audit access quarterly
3. **Document Grants**: Keep records of why access was granted
4. **Test Changes**: Verify permissions before sharing with users
5. **Backup Data**: Regular Firestore backups recommended

## Future Enhancements

Potential improvements for future versions:

- [ ] In-place permission editing
- [ ] Bulk user management (CSV import)
- [ ] Access expiration dates
- [ ] Activity/audit logging
- [ ] Email notifications for access changes
- [ ] Advanced role-based access control (RBAC)
- [ ] Project group permissions
- [ ] Time-limited access grants

## Version History

### Version 2.1 (Latest - Error Fixes)
- **Fixed Firebase authentication and permission errors**
  - Added user read permission to check own access grants
  - Added composite index for userAccess queries (userEmail + status)
  - Improved error handling with specific error codes
  - Added fallback to localStorage when Firebase operations fail
  - Better user-friendly error messages
  - Fixed "No user from redirect" console noise
  - See `DEPLOYMENT_GUIDE.md` for deployment instructions
  - See `TESTING_GUIDE.md` for test cases

### Version 2.0
- Streamlined access management UI
- Direct email-based user management
- Enhanced permission controls
- Firebase security rules
- Active user dashboard

### Version 1.0 (Legacy)
- Invite link system
- Basic permission flags
- URL-based access

## Credits

Developed for the Wine Monitoring System to provide better access control and user management capabilities while maintaining security and ease of use.

## License

This system is part of the Wine Monitoring application. All rights reserved.
