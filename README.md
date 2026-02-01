# הגדרת Firebase + כללי אבטחה + קישור חשבונות

כדי שהדברים יעבדו חלק:

## 1) יצירת פרויקט Firebase והפעלת Providers
- היכנס/י ל-[Firebase Console](https://console.firebase.google.com/) וצר/י פרויקט.
- ב‑Authentication → Sign-in method:
  - הפעל/י Email/Password.
  - הפעל/י Google.
- ב‑Project Settings → Your apps → Web app: צור/י אפליקציית Web וקבל/י את ה‑config.

## 2) הכנסת קונפיג לאפליקציה
- פתח/י את `firebase-config.js` והדבק/י את ה‑config שקיבלת.

## 3) פריסת כללי אבטחה ל‑Firestore
- אם דרך Console: Firestore → Rules → הדבק/י את התוכן מקובץ `firestore.rules` ולחץ/י Publish.
- אם דרך CLI:
  - `npm i -g firebase-tools`
  - `firebase login`
  - `firebase use --add`
  - `firebase deploy --only firestore:rules`

## 4) בדיקה מקומית
- פתח/י את `firebaseAuth.html` בדפדפן.
- בצעי הרשמה או התחברות.
- כבעל/ת חשבון, אשר/י מייל של משתמש אחר דרך הממשק (Allowlist).
- כמשתמש אחר, הזן/י את מייל הבעלים ולחץ/י "קשר/י לחשבון".
- במעבר חשבונות, בחר/י חשבון פעיל.

## מבנה נתונים ב‑Firestore
- `owners/{ownerUid}` — פרופיל מינימלי (מייל + שם תצוגה). קריא לכל משתמש מחובר.
- `allowlists/{ownerUid}/emails/{email}` — רשימת מיילים מורשים לקישור. ניהול בלעדי ע"י הבעלים.
- `links/{ownerUid}/members/{memberUid}` — קישור בפועל בין בעל חשבון למשתמש.
- `userData/{ownerUid}/...` — כל הדאטה של הבעלים.

## כללי אבטחה עיקריים
- קריאה/כתיבה ל‑`userData/{ownerUid}` מותרת רק לבעלים או למקושר.
- יצירת קישור מותרת רק אם המייל של המשתמש נמצא ב‑allowlist של הבעלים.
- ניהול allowlist — רק הבעלים.
- בדיקת קישור נעשית דרך `links/{ownerUid}/members/{memberUid}`.

לאחר המיזוג, תידרש:
1) להדביק את קונפיג Firebase ל‑`firebase-config.js`.
2) להפעיל Email/Password ו‑Google ב‑Authentication.
3) לפרוס את החוקים דרך Console או CLI.
4) לפתוח את `firebaseAuth.html` ולוודא שהזרימה חלקה.
