# Quick Start Guide

## Issues Fixed

This update fixes the following issues reported in Hebrew:

1. ✅ **Cross-Origin-Opener-Policy errors** - Google sign-in now works even when popups are blocked
2. ✅ **Firestore permission errors** - Added proper error handling and retry logic
3. ✅ **Network disconnection errors** - Automatic retry with exponential backoff
4. ✅ **No option to switch Google accounts** - Added "החלף חשבון Google" button
5. ✅ **Data not being saved** - All data now properly saves to Firestore

## What Changed for Users

### New Button: "החלף חשבון Google" (Switch Google Account)
- Located in the sidebar, below the "התחבר" button
- Only appears when logged in with Google
- Click to sign out and sign in with a different Google account
- Automatically prompts for account selection

### Better Error Messages
All error messages are now in Hebrew and more helpful:
- **Permission errors**: "שגיאת הרשאות: אנא וודא שאתה מחובר ויש לך הרשאות לשמור נתונים"
- **Network errors**: "שגיאת רשת: לא ניתן להתחבר ל-Firestore. הנתונים נשמרו מקומית."

### Automatic Features
- **Popup blocked?** The app automatically uses redirect method instead
- **Network problems?** The app automatically retries up to 3 times
- **Firestore unavailable?** Your data still saves locally (localStorage)

## First-Time Setup Required

### IMPORTANT: Update Firestore Security Rules

To fix the "Missing or insufficient permissions" error permanently:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nitur-wine**
3. Click **Firestore Database** → **Rules**
4. Replace with the rules from `FIRESTORE_SECURITY_RULES.md`
5. Click **Publish**

**Without this step, you will continue to see permission errors!**

See `FIRESTORE_SECURITY_RULES.md` for the complete rules and detailed instructions.

## How to Use the New Features

### Switching Google Accounts

1. Make sure you're signed in with Google
2. Look for the "החלף חשבון Google" button in the sidebar
3. Click it
4. Select a different Google account when prompted
5. Your data will be associated with the new account

### Understanding Error Messages

#### "שגיאת הרשאות" (Permission Error)
- **Cause**: Firestore security rules not configured
- **Solution**: Follow setup instructions in `FIRESTORE_SECURITY_RULES.md`

#### "שגיאת רשת" (Network Error)
- **Cause**: Internet connection issues
- **Solution**: The app will automatically retry. Your data is saved locally.

#### "החלון הקופץ נחסם" (Popup Blocked)
- **Cause**: Browser blocked the popup
- **Solution**: The app will automatically use redirect method instead

## Testing Your Setup

1. **Test Sign-In**:
   - Click "התחבר" button
   - Choose "התחבר עם Google"
   - Sign in should work (popup or redirect)

2. **Test Account Switching**:
   - After signing in, look for "החלף חשבון Google" button
   - Click it and select a different account
   - You should be signed out and prompted to sign in again

3. **Test Data Saving**:
   - Create a new project
   - Check browser console (F12) - should see "Projects synced to Firestore successfully"
   - If you see permission errors, apply the security rules from `FIRESTORE_SECURITY_RULES.md`

## Troubleshooting

### "הרשאות חסרות או לא מספיקות" keeps appearing
→ You need to apply the Firestore security rules. See `FIRESTORE_SECURITY_RULES.md`

### "החלף חשבון Google" button doesn't appear
→ Make sure you're signed in with Google (not email/password)

### Sign-in doesn't work
→ Check that Google provider is enabled in Firebase Console → Authentication → Sign-in method

### Data not syncing
→ Check your internet connection and browser console for specific error messages

## Support Files

- **FIRESTORE_SECURITY_RULES.md** - Complete security rules setup guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details of all changes
- **This file (QUICK_START.md)** - User-friendly quick start guide

## Need Help?

1. Check the browser console (F12) for detailed error messages
2. Read `FIRESTORE_SECURITY_RULES.md` for security rules setup
3. Read `IMPLEMENTATION_SUMMARY.md` for technical details
4. Verify your internet connection is stable
5. Try signing out and signing in again
