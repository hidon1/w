# הוראות התקנה ותצורה של Firebase

## תוכן עניינים
1. [הגדרת Firebase Console](#הגדרת-firebase-console)
2. [הפעלת Authentication](#הפעלת-authentication)
3. [כללי אבטחה ל-Firestore](#כללי-אבטחה-ל-firestore)
4. [כללי אבטחה ל-Storage](#כללי-אבטחה-ל-storage)
5. [מבנה מסד הנתונים](#מבנה-מסד-הנתונים)

---

## הגדרת Firebase Console

1. **היכנס ל-Firebase Console:**
   - גש ל-https://console.firebase.google.com/
   - בחר את הפרויקט `nitur-wine` (או צור פרויקט חדש)

2. **בדוק את תצורת הפרויקט:**
   - הקוד כבר מכיל את פרטי התצורה הנכונים
   - לא נדרשות פעולות נוספות

---

## הפעלת Authentication

### שלב 1: הפעל Email/Password Authentication

1. **נווט ל-Authentication:**
   - בתפריט הצד שמאל, לחץ על "Build" → "Authentication"
   - לחץ על הכפתור "Get Started" (אם זו הפעם הראשונה)

2. **הפעל Email/Password:**
   - לחץ על הטאב "Sign-in method"
   - מצא "Email/Password" ברשימת הספקים
   - לחץ עליו ולחץ על "Enable"
   - סמן את התיבה "Email/Password"
   - **אל תסמן** "Email link (passwordless sign-in)" אלא אם כן את/ה רוצה באמת בכך
   - לחץ "Save"

### שלב 2: הפעל Google Sign-In

1. **באותו מסך Sign-in method:**
   - מצא "Google" ברשימת הספקים
   - לחץ עליו ולחץ על "Enable"
   - בחר כתובת אימייל לתמיכה מהרשימה הנפתחת (בדרך כלל כתובת האימייל שלך)
   - לחץ "Save"

2. **הגדר OAuth Consent Screen (אם נדרש):**
   - אם תקבל/י הודעה על צורך בהגדרת OAuth screen
   - עקוב/עקבי אחר ההוראות להגדרת שם האפליקציה
   - שים/שימי לב שזה רק לשימוש פנימי

---

## כללי אבטחה ל-Firestore

### היכן להדביק את הכללים:

1. **נווט ל-Firestore Database:**
   - בתפריט הצד שמאל: "Build" → "Firestore Database"
   - לחץ על הטאב "Rules" בחלק העליון

2. **העתק והדבק את הכללים הבאים:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function - check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function - check if user is owner of account
    function isAccountOwner(accountId) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/accounts/$(accountId)).data.ownerUid == request.auth.uid;
    }
    
    // Helper function - check if user is member of account
    function isAccountMember(accountId) {
      return isAuthenticated() && 
             request.auth.token.email in get(/databases/$(database)/documents/accounts/$(accountId)).data.members;
    }
    
    // Rules for accounts collection
    match /accounts/{accountId} {
      // Allow read if user is a member
      allow read: if isAccountMember(accountId);
      
      // Allow create only authenticated users for their own account
      allow create: if isAuthenticated() && 
                      request.resource.data.ownerUid == request.auth.uid &&
                      request.auth.token.email in request.resource.data.members;
      
      // Allow update only if user is the owner
      // Members can only be added (not removed) by owner
      allow update: if isAccountOwner(accountId) &&
                      request.resource.data.ownerUid == resource.data.ownerUid;
      
      // Only owner can delete
      allow delete: if isAccountOwner(accountId);
      
      // Rules for messages subcollection
      match /messages/{messageId} {
        // Members can read messages
        allow read: if isAccountMember(accountId);
        
        // Members can create messages
        allow create: if isAccountMember(accountId) &&
                        request.resource.data.sender == request.auth.token.email;
        
        // No one can update or delete messages (immutable)
        allow update, delete: if false;
      }
    }
  }
}
```

3. **לחץ על "Publish" לפרסום הכללים**

### הסבר על הכללים:

- **accounts collection:** 
  - רק חברי החשבון יכולים לקרוא את פרטי החשבון
  - רק הבעלים יכול לעדכן את החשבון (כולל הוספת משתמשים)
  - רק הבעלים יכול למחוק את החשבון

- **messages subcollection:**
  - רק חברי החשבון יכולים לקרוא ולשלוח הודעות
  - הודעות הן immutable (לא ניתן לערוך או למחוק אחרי שליחה)

---

## כללי אבטחה ל-Storage

### היכן להדביק את הכללים:

1. **נווט ל-Storage:**
   - בתפריט הצד שמאל: "Build" → "Storage"
   - אם זו הפעם הראשונה, לחץ "Get Started" וסיים את ההתקנה
   - לחץ על הטאב "Rules" בחלק העליון

2. **העתק והדבק את הכללים הבאים:**

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper function - check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function - check if user is member of account
    function isAccountMember(accountId) {
      return isAuthenticated() && 
             request.auth.token.email in firestore.get(/databases/(default)/documents/accounts/$(accountId)).data.members;
    }
    
    // Rules for message images
    match /messages/{accountId}/{imageId} {
      // Members can read images from their account
      allow read: if isAccountMember(accountId);
      
      // Members can upload images (max 5MB)
      allow create: if isAccountMember(accountId) &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
      
      // No updates or deletes
      allow update, delete: if false;
    }
  }
}
```

3. **לחץ על "Publish" לפרסום הכללים**

### הסבר על הכללים:

- **הגבלת גודל:** קבצים מוגבלים ל-5MB
- **הגבלת סוג:** רק קבצי תמונה (image/*) מותרים
- **הרשאות:** רק חברי חשבון יכולים להעלות ולראות תמונות של החשבון שלהם
- **Immutable:** לא ניתן לעדכן או למחוק תמונות אחרי העלאה

---

## מבנה מסד הנתונים

### Collection: `accounts`

כל מסמך בקולקציה זו מייצג חשבון משותף.

**מבנה המסמך:**
```javascript
{
  "ownerUid": "firebase-uid-של-היוצר",
  "members": ["email1@example.com", "email2@example.com"],
  "createdAt": Timestamp,
  "displayName": "שם החשבון להצגה"
}
```

**שדות:**
- `ownerUid` (string): UID של Firebase של המשתמש שיצר את החשבון
- `members` (array): מערך של כתובות אימייל של כל החברים בחשבון
- `createdAt` (timestamp): תאריך יצירת החשבון
- `displayName` (string): שם תצוגה לחשבון

**מזהה המסמך (Document ID):**
- מזהה אנונימי בפורמט: `acc_[hash]`
- נוצר באופן אוטומטי ואינו חושף מידע אישי

### Subcollection: `accounts/{accountId}/messages`

כל מסמך מייצג הודעה שנשלחה בחשבון.

**מבנה המסמך:**
```javascript
{
  "text": "תוכן ההודעה (או null)",
  "imageUrl": "https://storage.googleapis.com/... (או null)",
  "sender": "email@example.com",
  "createdAt": Timestamp
}
```

**שדות:**
- `text` (string|null): תוכן טקסטואלי של ההודעה
- `imageUrl` (string|null): URL של התמונה המצורפת (אם יש)
- `sender` (string): אימייל של שולח ההודעה
- `createdAt` (timestamp): תאריך ושעת שליחת ההודעה

**הערות חשובות:**
- לפחות אחד מהשדות `text` או `imageUrl` חייב להכיל ערך
- הודעות הן immutable - לא ניתן לערוך או למחוק אחרי שליחה

---

## בדיקה ואימות

### בדיקת Authentication:
1. נסה להירשם עם אימייל וסיסמה
2. נסה להתחבר עם Google
3. ודא שאת/ה רואה את שמך בסטטוס האימות

### בדיקת Firestore:
1. לאחר התחברות, בדוק ב-Console → Firestore Database
2. אמור להיווצר מסמך חדש ב-collection `accounts`
3. ודא שהשדות `ownerUid` ו-`members` מאוכלסים כראוי

### בדיקת Messages:
1. נסה לשלוח הודעה טקסטואלית
2. נסה להעלות תמונה
3. ודא שההודעות מוצגות ברשימה

### בדיקת Storage:
1. לאחר העלאת תמונה, בדוק ב-Console → Storage
2. אמור להיווצר קובץ בתיקייה `messages/{accountId}/`
3. ודא שהקובץ נגיש דרך ה-URL

### בדיקת Security Rules:
1. נסה לגשת למסמך של חשבון אחר (צפוי להיכשל)
2. נסה להעלות קובץ שאינו תמונה (צפוי להיכשל)
3. נסה להעלות קובץ גדול מ-5MB (צפוי להיכשל)

---

## פתרון בעיות נפוצות

### שגיאת "Missing or insufficient permissions"
- **גורם:** כללי האבטחה חוסמים את הפעולה
- **פתרון:** ודא שהכללים הודבקו נכון ופורסמו

### שגיאת "Firebase: Error (auth/popup-blocked)"
- **גורם:** הדפדפן חוסם חלונות קופצים
- **פתרון:** אפשר חלונות קופצים עבור האתר

### התמונות לא נטענות
- **גורם:** כללי Storage לא מוגדרים או שגויים
- **פתרון:** ודא שכללי Storage פורסמו נכון

### לא ניתן להוסיף משתמש
- **גורם:** המשתמש הנוכחי אינו בעל החשבון
- **פתרון:** רק בעל החשבון יכול להוסיף משתמשים

---

## שימוש באפליקציה

### התחברות ראשונית:
1. לחץ על "התחבר" בסרגל הצד
2. בחר "הרשם" והזן אימייל וסיסמה
3. או לחץ "התחבר עם Google"

### ניהול חשבונות:
1. לאחר התחברות, לחץ על "הודעות Firebase" בתפריט
2. תיווצר אוטומטית חשבון ראשי עבורך
3. אם הוזמנת לחשבונות נוספים, תוכל להחליף ביניהם מהתפריט הנפתח

### הוספת משתמש:
1. הזן את כתובת האימייל של המשתמש
2. לחץ "הוסף משתמש"
3. המשתמש יוכל לראות את החשבון ברגע שיתחבר

### שליחת הודעה:
1. הקלד טקסט בשדה ההודעה (אופציונלי)
2. בחר תמונה (אופציונלי)
3. לחץ "שלח"
4. ההודעה תופיע מיד ברשימה

---

## אבטחה ופרטיות

### מזהה חשבון אנונימי:
- כל חשבון מקבל מזהה hash אנונימי
- המזהה לא חושף מידע על הבעלים או החברים
- פורמט: `acc_[16 characters]`

### הצפנה:
- כל התקשורת מוצפנת ב-HTTPS
- Firebase מספק הצפנה אוטומטית של הנתונים במאגר

### הרשאות:
- חברי חשבון רואים רק את המידע של החשבונות שלהם
- אין גישה לנתונים של חשבונות אחרים

---

## תמיכה

אם נתקלת בבעיות:
1. בדוק את Console של הדפדפן (F12 → Console) לשגיאות
2. בדוק את Firebase Console → Analytics לסטטיסטיקות
3. ודא שכל הכללים פורסמו נכון
