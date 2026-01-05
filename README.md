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

### "Permission Denied" Errors

**Problem**: User gets permission errors when accessing data

**Solutions**:
1. Verify security rules are deployed: `firebase deploy --only firestore:rules`
2. Check user email exactly matches granted email
3. Ensure access status is "active" in Firestore
4. Verify required indexes are created

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

### Version 2.0 (Current)
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
