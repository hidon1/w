# Firebase Error Fixes - Testing Guide

This document provides test cases to validate that the Firebase authentication and permission errors have been resolved.

## Test Environment Setup

### Prerequisites
1. Firebase project deployed with new rules and indexes
2. At least two test accounts:
   - Account A: Owner/Manager
   - Account B: User with granted access

## Test Cases

### TC1: Authentication - Google Login (Desktop)

**Objective**: Verify Google login works without redirect errors

**Steps**:
1. Open the app in desktop browser (Chrome/Firefox)
2. Click "התחבר עם Google" (Login with Google)
3. Select a Google account
4. Complete authentication

**Expected Results**:
- ✅ User successfully logged in
- ✅ No "No user from redirect" error in console
- ✅ User email displayed in sidebar
- ✅ Login button hidden, logout button shown

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC2: Authentication - Google Login (Mobile)

**Objective**: Verify Google login works on mobile devices

**Steps**:
1. Open the app on mobile device or emulator
2. Click "התחבר עם Google" (Login with Google)
3. Select a Google account
4. Complete authentication

**Expected Results**:
- ✅ Redirect method used (not popup)
- ✅ User successfully logged in after redirect
- ✅ No authentication errors
- ✅ App state restored after redirect

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC3: Permission Check - No Shared Access

**Objective**: Verify permission check doesn't fail for users without shared access

**Steps**:
1. Log in with Account A (owner account)
2. Open browser console (F12)
3. Look for error messages

**Expected Results**:
- ✅ No "permission-denied" errors in console
- ✅ May see "No shared access found for user" (informational only)
- ✅ App loads normally with own data
- ✅ No error alerts shown to user

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC4: Access Management - Grant Access

**Objective**: Verify granting access works without permission errors

**Steps**:
1. Log in with Account A (owner)
2. Open sidebar → "ניהול גישה" (Access Management)
3. Enter Account B email
4. Select "Edit" permission
5. Check "Finance Access"
6. Click "הענק גישה" (Grant Access)

**Expected Results**:
- ✅ Success message: "גישה הוענקה בהצלחה ל-{email}"
- ✅ User appears in active users list
- ✅ No permission errors in console
- ✅ Form cleared after success

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC5: Access Management - Load Active Users

**Objective**: Verify loading active users works with proper index

**Steps**:
1. Log in with Account A (owner who has granted access to others)
2. Open sidebar → "ניהול גישה" (Access Management)
3. Wait for users list to load

**Expected Results**:
- ✅ Active users list loads successfully
- ✅ Each user shows correct email, permissions, and project access
- ✅ No "failed-precondition" or "Index required" errors
- ✅ If no users: "אין משתמשים עם גישה כרגע" message

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC6: User Access - Query Own Access Grants

**Objective**: Verify users can query their own access grants

**Steps**:
1. Ensure Account B has been granted access by Account A (from TC4)
2. Log out and log in with Account B
3. Check browser console for errors

**Expected Results**:
- ✅ No "permission-denied" errors
- ✅ App automatically loads shared data if access granted
- ✅ Access notice appears at top: "גישה משותפת..."
- ✅ Permissions properly enforced based on grant settings

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC7: Error Handling - Specific Error Messages

**Objective**: Verify error messages are user-friendly and specific

**Test 7a: Invalid Email Format**

**Steps**:
1. Log in with Account A
2. Open Access Management
3. Enter invalid email: "notanemail"
4. Click Grant Access

**Expected Results**:
- ✅ Error message: "כתובת המייל אינה תקינה"
- ✅ No access created
- ✅ Form still visible

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

**Test 7b: Permission Denied (Simulated)**

To test this, temporarily modify security rules to deny access:

**Steps**:
1. In Firebase Console, temporarily deny userAccess writes
2. Try to grant access
3. Restore original rules

**Expected Results**:
- ✅ Specific error message mentioning permission
- ✅ Suggestion to check Firestore rules
- ✅ Error logged to console with code

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC8: Offline Mode - localStorage Fallback

**Objective**: Verify app works offline with localStorage

**Steps**:
1. Log in with Account A
2. Make some data changes
3. Disconnect from internet (airplane mode or disable network)
4. Make more data changes
5. Check console

**Expected Results**:
- ✅ App continues to work
- ✅ Console message: "Not logged in – saving to localStorage only"
- ✅ Data persists in browser
- ✅ No error alerts shown to user
- ✅ When reconnected, data syncs to Firebase

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC9: Revoke Access

**Objective**: Verify revoking access works correctly

**Steps**:
1. Log in with Account A (owner)
2. Open Access Management
3. Click delete/revoke button for Account B
4. Confirm revocation
5. Log out and log in as Account B

**Expected Results**:
- ✅ Success message: "הגישה נשללה בהצלחה"
- ✅ User removed from active users list
- ✅ Account B can no longer access shared data
- ✅ No errors in console

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC10: Firestore Indexes Status

**Objective**: Verify all required indexes are created and enabled

**Steps**:
1. Open Firebase Console
2. Navigate to Firestore → Indexes
3. Check index status

**Expected Results**:
- ✅ Index exists: userAccess (ownerUid, status, createdAt)
- ✅ Index exists: userAccess (userEmail, status)
- ✅ Both indexes show "Enabled" status
- ✅ No "Building" or "Error" status

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC11: Security Rules Validation

**Objective**: Verify security rules are correctly deployed

**Steps**:
1. Open Firebase Console
2. Navigate to Firestore → Rules
3. Check current rules

**Expected Results**:
- ✅ userAccess collection has two read rules:
  - Owner can read: `isOwner(resource.data.ownerUid)`
  - User can read own: `request.auth.email == resource.data.userEmail`
- ✅ Rules version shows recent deployment time
- ✅ No syntax errors

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

### TC12: Real-time Sync

**Objective**: Verify real-time synchronization works without errors

**Steps**:
1. Log in with Account A on Device 1
2. Log in with Account A on Device 2 (different browser/tab)
3. Make a change on Device 1
4. Observe Device 2

**Expected Results**:
- ✅ Change appears on Device 2 within a few seconds
- ✅ Sync notification appears: "✓ הנתונים עודכנו"
- ✅ No sync errors in console
- ✅ Data consistency across devices

**Actual Results**: _______________

**Status**: [ ] Pass [ ] Fail

---

## Summary

**Total Test Cases**: 12 (+ 2 sub-tests)

**Passed**: _____ / 14

**Failed**: _____ / 14

**Not Tested**: _____ / 14

## Issues Found

| Test Case | Issue Description | Severity | Status |
|-----------|------------------|----------|--------|
| TC# | | [ ] Critical [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed |

## Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Chrome (Android)
- [ ] Safari (iOS)

## Performance Notes

- Time to load active users: _____ ms
- Time to grant access: _____ ms
- Time to sync data: _____ ms

## Notes

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

## Sign-off

**Tester**: _______________

**Date**: _______________

**Environment**: [ ] Development [ ] Staging [ ] Production

**Result**: [ ] All tests passed [ ] Issues found (see above)
