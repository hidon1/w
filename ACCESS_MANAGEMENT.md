# Access Management System - Documentation

## Overview

The Wine Monitoring System features a **unified access management interface** that combines user access control and email account linking in one streamlined modal. This allows account managers to:
- Share their projects with other users via email
- Link multiple email addresses to their own account for multi-device access
- Manage all access-related settings from a single location

## Features

### Unified Interface with Two Tabs

#### Tab 1: Share Access with Users (שיתוף גישה למשתמשים)
Grant other users access to your projects via their email addresses.

**Features:**
- **Manual Email Input**: Managers can manually enter user email addresses
- **No Email Automation**: System works entirely within the application
- **Instant Access Control**: Changes take effect immediately
- **Granular Permissions**: Control view/edit rights and finance access
- **Project-Specific Access**: Grant access to all projects or specific ones

**Permission Types:**

1. **View Permission (Default)**
   - User can view all project data
   - No editing capabilities
   - Read-only access to financial information (if finance access is granted)

2. **Edit Permission**
   - User can view and edit project data
   - Can add/modify measurements and project details
   - Full project management capabilities (if granted)

3. **Finance Access**
   - Separate toggle for financial data access
   - Can be combined with either View or Edit permissions
   - Controls access to:
     - Financial reports
     - Income/expense management
     - Balance information

#### Tab 2: Link Email Addresses (חיבור כתובות מייל)
Add multiple email addresses to your own account for seamless multi-device login.

**Features:**
- **Multiple Email Support**: Link additional email/password combinations to your Firebase account
- **Same UID Access**: All linked emails authenticate to the same user ID
- **Multi-Device Login**: Sign in from different devices using different emails
- **Provider Display**: View all currently linked authentication providers (Google, email/password, etc.)

**Use Cases:**
- Access your account from work and personal emails
- Share access across multiple team members who need the same permissions
- Create backup login methods in case you lose access to one email

### Active User Management

- Real-time list of users with active access
- Visual permission badges showing:
  - User email
  - Permission level (View/Edit)
  - Project scope
  - Finance access status
- Quick actions:
  - Edit user permissions
  - Revoke access

## User Interface

### Unified Access Management Modal

The redesigned UI provides two tabs in one modal:

**Tab 1: Share Access with Users**
1. **Add New User Section**
   - Email input with validation
   - Project selection dropdown
   - Permission radio buttons (View/Edit)
   - Finance access checkbox
   - Grant Access button

2. **Active Users Section**
   - List of all users with current access
   - Color-coded permission badges
   - Edit and revoke buttons for each user

**Tab 2: Link Email Addresses**
1. **Currently Linked Emails**
   - Display of all authentication providers
   - Icons for Google, email/password, etc.
   - Email addresses for each provider

2. **Add New Email**
   - Email input field
   - Password field (minimum 6 characters)
   - Link button to add new email/password combination

## Firebase Backend

### Collections

#### `userAccess`
Stores direct user access grants:
```javascript
{
  ownerUid: string,        // Account manager's UID
  ownerEmail: string,      // Account manager's email
  userEmail: string,       // Granted user's email
  projectId: string|null,  // Specific project or null for all
  allowEdit: boolean,      // Edit permission
  allowFinance: boolean,   // Finance access permission
  status: string,          // 'active' or 'revoked'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### `wineMonitoringStates`
User project data with access control rules applied

### Security Rules

The system uses Firestore security rules to enforce:

1. **Owner Control**: Only account managers can manage access to their data
2. **Read Access**: Users with active access can read shared data
3. **Write Access**: Only users with `allowEdit: true` can modify data
4. **Finance Rules**: Financial data filtered based on `allowFinance` flag

### Authentication

Firebase Authentication handles:
- **Google Sign-In**: Primary authentication method
- **Email/Password Linking**: Additional authentication providers via `linkWithCredential`
- **Multi-Provider Support**: Users can have multiple authentication methods tied to one UID

## Implementation Details

### Key Functions

#### `openAccessControlModal()`
- Opens the unified access management modal
- Loads both active users and linked emails
- Defaults to the "Share Access" tab

#### `switchAccessTab(tabName)`
- Switches between tabs (shareAccess or linkEmails)
- Handles tab activation and content display
- Smooth fade-in animation for tab content

#### `grantUserAccess()`
- Validates email format
- Creates new access record in Firestore
- Updates active users list
- Clears form after success

#### `loadActiveUsers()`
- Queries Firestore for active access records
- Renders user list with permission badges
- Shows/hides "no users" message

#### `revokeUserAccess(accessId, userEmail)`
- Updates status to 'revoked'
- Removes from active users list
- Requires confirmation

#### `linkNewEmail()`
- Creates email/password credential
- Links credential to current user via `linkWithCredential()`
- Refreshes linked emails list

#### `loadLinkedEmails()`
- Displays all authentication providers for current user
- Shows provider icons and email addresses

### Permission Enforcement

The system enforces permissions at multiple levels:

1. **UI Level**: Buttons and actions disabled for unauthorized users
2. **Application Level**: Function checks before operations
3. **Firebase Level**: Security rules prevent unauthorized access

## Setup Instructions

### 1. Deploy Firebase Security Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Create Indexes (if needed)

Firebase may require composite indexes for queries:
- Collection: `userAccess`
- Fields: `ownerUid` (Ascending), `status` (Ascending), `createdAt` (Descending)

### 3. Test Access Control

1. Create a test user account
2. Grant access from manager account
3. Verify permissions work as expected
4. Test revocation
5. Test email linking functionality

## Best Practices

### For Account Managers

1. **Use Specific Project Access**: Grant access to specific projects when possible
2. **Review Regularly**: Periodically review active users
3. **Minimum Permissions**: Start with View-only, grant Edit as needed
4. **Finance Access**: Only grant to trusted users

### For Multi-Email Setup

1. **Link Before You Need It**: Set up additional emails before losing access to primary
2. **Use Strong Passwords**: Minimum 6 characters, but longer is better
3. **Remember Your Emails**: Keep track of which emails are linked

### For Developers

1. **Security First**: Always validate permissions server-side
2. **User Experience**: Provide clear feedback on permission errors
3. **Error Handling**: Gracefully handle permission denied errors
4. **Testing**: Test all permission combinations

## Troubleshooting

### Users Can't Access Shared Data

1. Verify user's email exactly matches granted email
2. Check access status is 'active'
3. Ensure Firebase rules are deployed
4. Check browser console for errors

### Email Linking Fails

1. Ensure email isn't already in use by another account
2. Verify password is at least 6 characters
3. Check user is properly authenticated
4. Review Firebase Authentication logs

### Permission Changes Not Reflecting

1. User may need to refresh browser
2. Check Firestore for updated access record
3. Verify security rules are up to date
4. Check real-time listener connections

### Firebase Permission Errors

1. Check security rules are deployed
2. Verify required indexes are created
3. Review Firestore console for rule evaluation
4. Ensure user has proper authentication

## Future Enhancements

- [ ] Edit user permissions in-place
- [ ] Bulk user management
- [ ] Access expiration dates
- [ ] Activity logging
- [ ] Email notifications for access changes
- [ ] Role-based access (Admin, Manager, Viewer)
- [ ] Unlink email functionality

## Support

For issues or questions:
1. Check Firebase console for errors
2. Review browser console logs
3. Verify security rules are correctly deployed
4. Ensure all required fields are populated

---

**Version:** 2.0.0  
**Last Updated:** January 28, 2026  
**Status:** ✅ Production Ready
