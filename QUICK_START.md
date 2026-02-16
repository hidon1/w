# Quick Start Guide - Local-Only Mode

## 🚀 Getting Started

This wine monitoring system now operates in **local-only mode**. All data is stored locally in your browser - no cloud services, no authentication, no setup required!

## ✅ Quick Start

### Step 1: Open the Application
1. Open `index.html` in your web browser
2. Or serve it with a local web server:
   ```bash
   # Python
   python3 -m http.server 8000
   
   # Node.js
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

### Step 2: Start Using
1. The application loads immediately - no login required
2. Start creating projects and tracking your wine production
3. All data is automatically saved to browser localStorage

## 💾 Data Storage

### Where is your data stored?
- **Location**: Browser's localStorage (in your browser on this device)
- **Persistence**: Data persists between sessions (until you clear browser data)
- **Accessibility**: Single device, single browser only

### What data is stored locally?
- Projects and all wine production data
- Reminders and notifications
- Inbox items
- User preferences (dark mode, etc.)
- Custom stages configuration

## 🎯 Core Features

### Available Features:
✅ Wine production project management  
✅ Stage-by-stage tracking (harvest, crushing, fermentation, aging, bottling)  
✅ Custom metrics and measurements  
✅ Reminders with notifications  
✅ Financial tracking  
✅ Project comparison and analytics  
✅ Data export (PDF/Excel)  
✅ Dark mode  
✅ Hebrew interface (RTL support)  

### NOT Available (Removed):
❌ Cloud synchronization  
❌ Multi-device access  
❌ User authentication  
❌ Project sharing between users  
❌ Cross-device data sync  

## ⚠️ Important Notes

### Data Backup
Since data is stored only in your browser:
1. **Regular backups recommended**: Use the export feature to save your data
2. **Clearing browser data will delete projects**: Be careful with browser cleaning tools
3. **Incognito/Private mode**: Data won't persist after closing the browser

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires localStorage support (available in all modern browsers)

### Multiple Devices
- To use on multiple devices, you'll need to manually export/import data
- Each device maintains its own independent data

## 📊 Monitoring Your Data

### Check Data Storage:
1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Click on "Local Storage"
4. Look for keys: `projects`, `reminders`, `inbox`, `preferences`

### Storage Limits:
- localStorage typically has 5-10MB limit per domain
- Images stored in IndexedDB (larger limit)
- For very large projects, consider periodic cleanup

## 🆘 Troubleshooting

### Application doesn't load
- Check JavaScript is enabled in your browser
- Check browser console for errors
- Try clearing browser cache and reload

### Data not saving
- Check browser console for errors
- Verify localStorage is not disabled
- Check you're not in incognito/private browsing mode
- Verify storage quota hasn't been exceeded

### Lost data
- If you cleared browser data, data is permanently lost
- Check if you have an exported backup
- Data cannot be recovered without a backup

## 🔄 Migrating from Firebase Version

If you were using the previous Firebase version:

1. **Export your cloud data** (if still accessible via Firebase Console)
2. **This version starts fresh** - no automatic migration
3. **Manual data entry** or import required
4. **Consider exporting regularly** for backup

## 📚 Additional Resources

- **Removal Details**: See `REMOVED_FIREBASE.md` for what was removed
- **Storage Implementation**: See `storage-local.js` for storage API
- **Old Firebase Docs** (archived): 
  - `FIREBASE_INTEGRATION.md` - No longer applicable
  - `FIRESTORE_SECURITY_RULES.md` - No longer applicable

## 🎉 You're Ready!

That's it! No configuration, no setup, no deployment needed. Just open the app and start tracking your wine production.

The application will show "עבודה מקומית בלבד" (Local work only) in the status area to indicate local-only mode.

## 💡 Tips

1. **Regular Exports**: Export your data regularly as backup
2. **Browser Bookmarks**: Bookmark the local page for easy access
3. **Don't Clear Browser Data**: Your projects are stored there
4. **One Browser**: Stick to one browser to avoid data fragmentation

---

**Version**: Local-Only Mode v1.0  
**Date**: February 16, 2026
