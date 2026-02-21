# Firebase Storage: CORS והרשאות הורדה

אם בדפדפן מתקבלת שגיאה כמו:

- `No 'Access-Control-Allow-Origin' header is present`
- `Storage SDK blob fetch failed, falling back to URL fetch`
- `storage/retry-limit-exceeded`

ברוב המקרים זו **בעיית CORS** של ה־bucket, ולא בהכרח בעיית `rules`.

## 1) Rules מומלצים להורדה (Authenticated users)

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // גישה לקבצים של הפרויקט לפי חשבון+פרויקט
    match /accounts/{uid}/projects/{projectId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // קבצים ציבוריים (אם צריך)
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

> אם רוצים הורדה ציבורית לגמרי לקבצים מסוימים, יש לשים אותם תחת `public/`.



## 1.1) Rules חלופיים (Public read לכל הקבצים)

> ⚠️ להשתמש בזה רק אם אתה באמת רוצה שכל מי שמחזיק קישור יוכל לקרוא קבצים מה־bucket.

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

אם אתה רוצה גם כתיבה ציבורית (לא מומלץ):

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 2) CORS שצריך להגדיר על ה־bucket

צור קובץ `cors.json`:

```json
[
  {
    "origin": [
      "https://hidon1.github.io",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],
    "method": ["GET", "HEAD", "OPTIONS"],
    "responseHeader": ["Content-Type", "x-goog-meta-*"],
    "maxAgeSeconds": 3600
  }
]
```

החל את ההגדרה (עם `gcloud`):

```bash
gcloud storage buckets update gs://wine-f57cb.firebasestorage.app --cors-file=cors.json
```

או עם `gsutil` (אם מותקן):

```bash
gsutil cors set cors.json gs://wine-f57cb.firebasestorage.app
```

## 3) דגשים חשובים

- `rules` לא מוסיפים כותרת `Access-Control-Allow-Origin`; זה מגיע מ־CORS של ה־bucket.
- ב־GitHub Pages חובה להוסיף את origin המדויק (`https://hidon1.github.io`).
- אם משתמשים ב־custom domain, צריך להוסיף גם אותו לרשימת ה־origins.
- אחרי שינוי CORS, לפעמים צריך להמתין דקה-שתיים ולרענן קשיח (`Ctrl+Shift+R`).

## 4) בדיקה מהירה

1. בדוק ב־DevTools שה־request ל־`firebasestorage.googleapis.com` חוזר עם `Access-Control-Allow-Origin`.
2. אם אין header כזה – הבעיה ב־CORS, לא ב־rules.
3. אם יש header אבל מתקבלת `storage/unauthorized` – הבעיה ב־rules / auth.
