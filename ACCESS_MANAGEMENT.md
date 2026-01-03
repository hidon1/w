# Access Management System - Documentation

## Overview

The Wine Monitoring System now features a streamlined access management system that allows account managers to directly control user access to their projects without relying on external email automation or invite links.

## Features

### 1. Direct User Management
- **Manual Email Input**: Managers can manually enter user email addresses
- **No Email Automation**: System works entirely within the application
- **Instant Access Control**: Changes take effect immediately

### 2. Granular Permissions

#### View Permission (Default)
- User can view all project data
- No editing capabilities
- Read-only access to financial information (if finance access is granted)

#### Edit Permission
- User can view and edit project data
- Can add/modify measurements and project details
- Full project management capabilities (if granted)

#### Finance Access
- Separate toggle for financial data access
- Can be combined with either View or Edit permissions
- Controls access to:
  - Financial reports
  - Income/expense management
  - Balance information

### 3. Project-Specific Access
- Grant access to all projects or specific projects
- Flexible project selection
- Automatic project list population

### 4. Active User Management
- Real-time list of users with active access
- Visual permission badges showing:
  - User email
  - Permission level (View/Edit)
  - Project scope
  - Finance access status
- Quick actions:
  - Edit user permissions (coming soon)
  - Revoke access

## User Interface

### Access Management Modal

The redesigned UI provides:

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

## Migration from Old System

The old invite-based system is deprecated but maintained for backward compatibility:
- Old `projectAccessInvites` collection still works
- New `userAccess` collection is the primary system
- No breaking changes to existing access

## Implementation Details

### Key Functions

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

## Best Practices

### For Account Managers

1. **Use Specific Project Access**: Grant access to specific projects when possible
2. **Review Regularly**: Periodically review active users
3. **Minimum Permissions**: Start with View-only, grant Edit as needed
4. **Finance Access**: Only grant to trusted users

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

### Permission Changes Not Reflecting

1. User may need to refresh browser
2. Check Firestore for updated access record
3. Verify security rules are up to date

### Firebase Permission Errors

1. Check security rules are deployed
2. Verify required indexes are created
3. Review Firestore console for rule evaluation

## Future Enhancements

- [ ] Edit user permissions in-place
- [ ] Bulk user management
- [ ] Access expiration dates
- [ ] Activity logging
- [ ] Email notifications for access changes
- [ ] Role-based access (Admin, Manager, Viewer)

## Support

For issues or questions:
1. Check Firebase console for errors
2. Review browser console logs
3. Verify security rules are correctly deployed
4. Ensure all required fields are populated
