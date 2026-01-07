# Deployment Guide for Recent Updates

This guide provides step-by-step instructions for deploying the recent updates to production.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- Logged in to Firebase (`firebase login`)
- Access to the Firebase project console

## 1. Deploy Firestore Security Rules

The application now uses two new Firestore collections:
- `userReminders` - User-specific reminders
- `userInbox` - User-specific inbox messages

### Deploy Command:
```bash
firebase deploy --only firestore:rules
```

### Verify Deployment:
1. Go to Firebase Console → Firestore Database → Rules
2. Verify the following rules exist:
```
match /userReminders/{userId} {
  allow read, write: if isOwner(userId);
}

match /userInbox/{userId} {
  allow read, write: if isOwner(userId);
}
```

## 2. Enable and Deploy Firebase Storage

Firebase Storage is now required for image uploads in reminders.

### Enable Storage:
1. Go to Firebase Console
2. Navigate to Storage section
3. Click "Get Started"
4. Choose your storage location (preferably same as Firestore)
5. Click "Done"

### Deploy Storage Rules:
```bash
firebase deploy --only storage
```

### Verify Storage Rules:
1. Go to Firebase Console → Storage → Rules
2. Verify rules allow authenticated users to upload images to their own folder
3. Check that file size limit (5MB) and content type (images only) are enforced

## 3. Deploy Hosting (Website Files)

Deploy the updated HTML, CSS, and configuration files:

```bash
firebase deploy --only hosting
```

### Files Being Deployed:
- `index.html` - Updated with new features
- `t.css` - Updated with new styles
- `firebase.json` - Updated with storage rules configuration

## 4. Deploy All at Once (Recommended)

To deploy everything in one command:

```bash
firebase deploy
```

This will deploy:
- Firestore rules
- Storage rules
- Hosting files

## 5. Post-Deployment Verification

### Test Checklist:

#### Mobile Animation Test:
1. Open the site on a mobile device
2. Refresh the page completely
3. Verify smooth loading without jumping elements

#### Real-time Sync Test:
1. Log in on two different devices
2. Add a reminder on Device 1
3. Verify it appears on Device 2 within 1-2 seconds

#### Image Upload Test:
1. Open Reminders modal
2. Upload an image via file picker
3. Verify image is uploaded to Storage
4. Check Firebase Console → Storage to see the uploaded file

#### Inbox Email Design Test:
1. Open Inbox modal
2. Verify email-like design with envelope icons
3. Click to expand/collapse messages
4. Verify images display correctly

#### Camera Test (Mobile Only):
1. Open Reminders on mobile device
2. Click "צלם" (Camera) button
3. Allow camera access
4. Capture a photo
5. Verify it uploads successfully

### Check Firebase Console:

#### Firestore:
1. Go to Firestore Database → Data
2. Check for `userReminders` collection
3. Check for `userInbox` collection
4. Verify data structure matches expected format

#### Storage:
1. Go to Storage → Files
2. Navigate to `reminders/` folder
3. Check that uploaded images are organized by user ID
4. Verify file names follow pattern: `{reminderId}_{timestamp}.jpg`

## 6. Rollback Plan

If issues occur after deployment:

### Rollback Hosting:
```bash
# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

### Rollback Firestore Rules:
1. Go to Firebase Console → Firestore → Rules
2. Click on the "Rules History" tab
3. Select previous version
4. Click "Publish"

### Rollback Storage Rules:
1. Go to Firebase Console → Storage → Rules
2. Click on the "Rules History" tab
3. Select previous version
4. Click "Publish"

## 7. Monitoring and Troubleshooting

### Check Firebase Logs:
```bash
firebase functions:log
```

### Common Issues:

#### Issue: "Permission denied" errors in console
**Cause:** Firestore rules not deployed correctly
**Solution:** Re-deploy rules: `firebase deploy --only firestore:rules`

#### Issue: Images not uploading
**Cause:** Storage not enabled or rules not deployed
**Solution:** 
1. Enable Storage in Firebase Console
2. Deploy storage rules: `firebase deploy --only storage`

#### Issue: Real-time sync not working
**Cause:** Browser caching old JavaScript
**Solution:** 
1. Clear browser cache
2. Hard refresh (Ctrl+F5)
3. Ensure persistence is enabled in Firestore

#### Issue: Mobile animations still jumping
**Cause:** Browser cached old CSS
**Solution:**
1. Clear cache completely
2. Force reload with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## 8. Performance Optimization (Post-Deployment)

### Enable Firestore Offline Persistence:
Already enabled in code:
```javascript
db.enablePersistence({ synchronizeTabs: true })
```

### Optimize Storage:
1. Set up lifecycle rules to delete old temporary files
2. Enable compression for images if needed
3. Set up CDN caching in Firebase Hosting settings

### Monitor Usage:
1. Go to Firebase Console → Usage and billing
2. Monitor Firestore reads/writes
3. Monitor Storage bandwidth
4. Set up alerts for unusual activity

## 9. Security Best Practices

### Regular Security Checks:
1. Review Firestore security rules monthly
2. Audit user access grants
3. Monitor authentication logs
4. Check for suspicious storage uploads

### Storage Security:
- Files are private by default (accessible only by owner)
- File size limits prevent abuse (5MB max)
- Content type validation ensures only images
- No public read access without authentication

### Firestore Security:
- All collections require authentication
- Users can only access their own data
- Shared access is controlled via userAccess collection
- Real-time listeners respect security rules

## 10. Backup and Recovery

### Backup Strategy:
1. Enable automated Firestore backups in Console
2. Export user data regularly
3. Keep copies of security rules
4. Document all configuration changes

### Export User Data:
```bash
# Export Firestore data
gcloud firestore export gs://[BUCKET_NAME]

# Download Storage files
gsutil -m cp -r gs://[BUCKET_NAME]/reminders ./backup/
```

## Environment-Specific Notes

### Development:
- Use Firebase emulators for testing: `firebase emulators:start`
- Test rules locally before deploying
- Use separate Firebase project for development

### Staging:
- Deploy to staging environment first
- Run full test suite
- Verify all features work correctly
- Get approval before production deployment

### Production:
- Deploy during low-traffic hours
- Monitor error logs closely
- Have rollback plan ready
- Notify users of new features

## Support and Documentation

### User Documentation:
- Update user guide with new features
- Create video tutorials for image upload
- Document inbox email interface
- Add FAQ for common issues

### Developer Documentation:
- Update API documentation
- Document new Firestore collections
- Update architecture diagrams
- Keep this deployment guide current

## Contact Information

For deployment issues or questions:
- Check Firebase Console for real-time status
- Review Firebase documentation: https://firebase.google.com/docs
- Contact project maintainer: [Your contact info]

## Deployment History

Document each deployment:

| Date | Version | Changes | Deployed By | Notes |
|------|---------|---------|-------------|-------|
| 2024-01-07 | 1.2.0 | Mobile animations, real-time sync, image uploads, email inbox | Copilot | Initial deployment of new features |

---

**Last Updated:** 2024-01-07
**Document Version:** 1.0
