# Firebase Authentication UI Preview

## Visual Structure of firebaseAuth.html

```
┌─────────────────────────────────────────────────────────────┐
│  התחברות, הרשאות וקישור חשבונות                            │
│                                                               │
│  Status: לא מחובר/ת                                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ╔═══ התחברות בסיסית ═════════════════════════════════╗    │
│  ║                                                       ║    │
│  ║  מייל                                                 ║    │
│  ║  [___________________________________]                ║    │
│  ║                                                       ║    │
│  ║  סיסמה                                                ║    │
│  ║  [___________________________________]                ║    │
│  ║                                                       ║    │
│  ║  [ הרשמה (מייל/סיסמה) ] [ התחברות (מייל/סיסמה) ]   ║    │
│  ║  [ התחברות עם Google ] [ יציאה ]                    ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                               │
│  ╔═══ בעל/ת חשבון: הרשאות לקישור ═════════════════════╗    │
│  ║                                                       ║    │
│  ║  הוסף/י מייל שמורשה להתקשר לחשבון שלך              ║    │
│  ║  [___________________________________]                ║    │
│  ║  [ אשר/י מייל לקישור ]                              ║    │
│  ║                                                       ║    │
│  ║  רק בעל/ת החשבון יכול/ה לנהל את הרשימה.             ║    │
│  ║  הכללים מונעים גישה מכל אחד אחר.                    ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                               │
│  ╔═══ קישור לחשבון של מישהו אחר ═══════════════════════╗   │
│  ║                                                       ║    │
│  ║  הכנס/י מייל של בעל/ת החשבון                        ║    │
│  ║  [___________________________________]                ║    │
│  ║  [ קשר/י לחשבון ]                                    ║    │
│  ║                                                       ║    │
│  ║  המערכת בודקת אם המייל שלך נמצא ברשימת             ║    │
│  ║  ההרשאות של אותו/ה בעל/ת חשבון.                     ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                               │
│  ╔═══ מעבר בין חשבונות ═══════════════════════════════╗    │
│  ║                                                       ║    │
│  ║  בחר/י חשבון פעיל לעבודה (אני או בעלים שקושרו)     ║    │
│  ║  [▼ Select Account ______________________]           ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                               │
│  ╔═══ דוגמה לשמירת דאטה תחת החשבון הפעיל ═════════════╗   │
│  ║                                                       ║    │
│  ║  [ שמור דאטה לדוגמה ]                                ║    │
│  ╚═══════════════════════════════════════════════════════╝    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## UI Features

### 1. Status Bar
- Shows current authentication status
- Updates to show logged-in user email
- Updates to show active account context

### 2. Basic Authentication Section
**Elements:**
- Email input field
- Password input field
- Four buttons in a row:
  - הרשמה (מייל/סיסמה) - Signup with email/password
  - התחברות (מייל/סיסמה) - Login with email/password
  - התחברות עם Google - Login with Google
  - יציאה - Logout

### 3. Owner Permissions Section
**Purpose:** For account owners to authorize other users

**Elements:**
- Email input field (for collaborator's email)
- "אשר/י מייל לקישור" button - Approve email for linking
- Explanatory text about owner-only permissions

**Behavior:**
- Only accessible when logged in
- Adds email to owner's allowlist in Firestore
- Protected by security rules (owner-only write access)

### 4. Account Linking Section
**Purpose:** For users to link to owner accounts

**Elements:**
- Email input field (for owner's email)
- "קשר/י לחשבון" button - Link to account
- Explanatory text about permission checking

**Behavior:**
- User enters owner's email
- System looks up owner by email
- Attempts to create link
- Firestore rules validate user's email is in allowlist
- Success: User gains access to owner's data
- Failure: Permission denied error

### 5. Account Switching Section
**Purpose:** Switch between own account and linked accounts

**Elements:**
- Dropdown select menu
- Shows "אני (email)" for own account
- Shows "בעל חשבון: uid" for each linked account

**Behavior:**
- Dynamically populated after login
- Updates when new links are created
- Changing selection updates active account context
- All data operations use active account

### 6. Example Data Section
**Purpose:** Demonstrate data saving under active account

**Elements:**
- "שמור דאטה לדוגמה" button - Save example data

**Behavior:**
- Saves random data to Firestore
- Uses active account context (own or linked)
- Data saved to: `userData/{activeOwnerUid}/examples/`
- Protected by security rules

## Styling

**Layout:**
- Max width: 720px
- Centered on page
- Right-to-left (RTL) text direction
- Clean, modern design

**Fieldsets:**
- 1px solid border (#ddd)
- Padding: 1rem
- Margin bottom: 1rem
- Clear visual separation

**Inputs:**
- Full width
- Padding: 0.5rem
- Bottom margin: 0.5rem

**Buttons:**
- Padding: 0.5rem 1rem
- Right margin: 0.5rem
- Grouped in rows with flexbox

## User Experience Flow

### First-Time User (Owner)
1. Open firebaseAuth.html
2. See "לא מחובר/ת" status
3. Enter email and password
4. Click "הרשמה (מייל/סיסמה)"
5. Status updates to "מחובר/ת: [email]"
6. Enter collaborator's email in allowlist section
7. Click "אשר/י מייל לקישור"
8. Alert: "המייל אושר לקישור"
9. Work with own data

### Collaborator User
1. Open firebaseAuth.html
2. Sign up or login
3. Enter owner's email in linking section
4. Click "קשר/י לחשבון"
5. If approved: Alert "החשבון קושר בהצלחה"
6. If not approved: Error "Missing permissions"
7. Account dropdown now shows owner's account
8. Switch to owner's account
9. Save data - goes to owner's userData

### Account Switching
1. Login to own account
2. Link to one or more owner accounts
3. Dropdown shows all available accounts
4. Select account from dropdown
5. Status updates to show active account
6. Click "שמור דאטה לדוגמה"
7. Data saved under selected account

## Security Highlights

✅ **Authentication Required:** All operations require login
✅ **Owner Protection:** Only owner can manage allowlist
✅ **Link Validation:** Links only created if email approved
✅ **Data Isolation:** Data accessible only to owner + linked users
✅ **No Link Updates:** Links are immutable after creation
✅ **Firestore Rules:** Server-side validation of all operations

## Technical Implementation

**Module System:** ES6 modules with imports
**Firebase SDK:** v10.9.0 (from CDN)
**Event Handling:** addEventListener for all interactions
**State Management:** 
- `activeOwnerUid` variable for current context
- `auth.currentUser` for authentication state
**Error Handling:** try/catch with user-friendly alerts
**Async Operations:** All Firebase calls are async/await

## Browser Compatibility

**Requirements:**
- ES6 module support
- Async/await support
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (for Firebase SDK and API calls)

## Testing Checklist

- [ ] Email signup works
- [ ] Email login works  
- [ ] Google login works
- [ ] Logout works
- [ ] Owner can add email to allowlist
- [ ] User with approved email can link
- [ ] User without approved email gets denied
- [ ] Account dropdown populates correctly
- [ ] Account switching updates context
- [ ] Example data saves under correct account
- [ ] All error messages display properly
