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
- ודא/י שיש לך Firebase CLI (מומלץ), או פרוס/י דרך ה‑Console.
- בעזרת CLI, הוסף/י פרויקט: `firebase use --add` ובחר/י את הפרויקט שלך.
- פרוס/י את החוקים: `firebase deploy --only firestore:rules`.

> קובץ `firebase.json` מצביע על `firestore.rules` כדי להבטיח שהפריסה נכונה.

## 4) בדיקה מקומית
- פתח/י את `firebaseAuth.html` בדפדפן.
- בצעי הרשמה או התחברות.
- כבעל/ת חשבון, אשר/י מייל של משתמש אחר דרך הממשק (Allowlist).
- כמשתמש אחר, הזן/י את מייל הבעלים ולחץ/י "קשר/י לחשבון".
- במעבר חשבונות, בחר/י חשבון פעיל כשתרצה לעבוד על הדאטה.

## מבנה נתונים ב‑Firestore
- `owners/{ownerUid}` — פרופיל מינימלי (מייל + שם תצוגה). קריא לכל משתמש מחובר כדי לאפשר חיפוש לפי מייל.
- `allowlists/{ownerUid}/emails/{email}` — רשימת מיילים מורשים לקישור. ניהול בלעדי ע"י הבעלים.
- `links/{ownerUid}_{memberUid}` — קישור בפועל בין בעל חשבון למשתמש.
- `userData/{ownerUid}/...` — כל הדאטה של הבעלים.

## כללי אבטחה עיקריים
- קריאה/כתיבה ל‑`userData/{ownerUid}` מותרת רק לבעלים או למקושר.
- יצירת קישור מותרת רק אם המייל של המשתמש נמצא ב‑allowlist של הבעלים.
- ניהול allowlist — רק הבעלים.

## הערות אבטחה
- הכללים משתמשים ב‑`request.auth.token.email`. ודאו שההתחברות היא עם ספק שמספק אימייל (Email/Password או Google).
- **ספקי התחברות נתמכים**: Email/Password, Google. ספקים אחרים (כמו Anonymous) לא יעבדו עם מערכת הקישור.
- מומלץ לאחסן אימיילים lowercase באופן עקבי.
- הימנעו מחשיפת מידע רגיש במסמכי `owners` — שמרנו אותם מינימליים.
