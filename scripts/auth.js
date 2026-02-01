import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { firebaseConfig } from "../firebase-config.js";

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// מצב חשבון פעיל (בעלים או מקושר)
let activeOwnerUid = null; // ברירת מחדל: ה-uid של המשתמש המחובר עצמו

// יצירת/עדכון פרופיל בעלים מינימלי לאחר התחברות
async function ensureOwnerProfile(user) {
  const ownerRef = doc(db, "owners", user.uid);
  const snapshot = await getDoc(ownerRef);
  const base = {
    email: user.email || null,
    displayName: user.displayName || null,
    updatedAt: new Date().toISOString()
  };
  if (snapshot.exists()) {
    await setDoc(ownerRef, base, { merge: true });
  } else {
    await setDoc(ownerRef, { ...base, createdAt: new Date().toISOString() });
  }
}

// התחברות במייל/סיסמה
export async function signupWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await ensureOwnerProfile(cred.user);
}

export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureOwnerProfile(cred.user);
}

// התחברות עם Google
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await ensureOwnerProfile(cred.user);
}

// יציאה
export async function logout() {
  await signOut(auth);
}

// בעל חשבון מוסיף מייל לרשימת ההרשאות (allowlist)
export async function allowEmailForLink(emailToAllow) {
  const user = auth.currentUser;
  if (!user) throw new Error("לא מחובר/ת");
  const ref = doc(db, "allowlists", user.uid, "emails", emailToAllow);
  await setDoc(ref, { createdAt: new Date().toISOString() });
}

// משתמש מזין מייל של בעל חשבון ומנסה להתקשר אליו
export async function linkToOwnerByEmail(ownerEmail) {
  const user = auth.currentUser;
  if (!user) throw new Error("לא מחובר/ת");
  // חיפוש ownerUid לפי אימייל (בקריאה מותרת לפי הכללים) — אמור להיות ייחודי
  const ownersQ = query(collection(db, "owners"), where("email", "==", ownerEmail));
  const ownersSnap = await getDocs(ownersQ);
  if (ownersSnap.empty) throw new Error("לא נמצא בעל חשבון עם המייל הזה");
  const ownerDoc = ownersSnap.docs[0];
  const ownerUid = ownerDoc.id;

  // ניסיון יצירת קישור: יחסום לפי הכללים אם אין הרשאה במייל של המשתמש
  const linkId = `${ownerUid}_${user.uid}`;
  const linkRef = doc(db, "links", linkId);
  await setDoc(linkRef, {
    ownerUid,
    memberUid: user.uid,
    createdAt: new Date().toISOString()
  });

  // לאחר קישור: הפיכת חשבון הבעלים לחשבון פעיל להקשר הנתונים
  activeOwnerUid = ownerUid;
  renderLinkedAccounts();
}

// החלפת חשבון פעיל בין "אני" לבין בעלים שקישרתי
export async function switchActiveOwner(uid) {
  activeOwnerUid = uid; // יכול להיות auth.currentUser.uid או uid של בעל חשבון מקושר
  renderLinkedAccounts();
}

// דוגמה לכתיבת דאטה תחת חשבון פעיל
export async function saveExampleData(payload) {
  const user = auth.currentUser;
  if (!user) throw new Error("לא מחובר/ת");
  const targetOwner = activeOwnerUid || user.uid;
  const col = collection(db, "userData", targetOwner, "examples");
  await addDoc(col, { ...payload, savedAt: new Date().toISOString() });
}

// שליפת חשבונות מקושרים למשתמש הנוכחי
export async function getLinkedOwnersForCurrentUser() {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, "links"), where("memberUid", "==", user.uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data().ownerUid);
}

// UI בסיסי
const els = {
  email: document.getElementById('email'),
  password: document.getElementById('password'),
  loginEmailBtn: document.getElementById('loginEmailBtn'),
  signupBtn: document.getElementById('signupBtn'),
  loginGoogleBtn: document.getElementById('loginGoogleBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  allowEmailInput: document.getElementById('allowEmailInput'),
  allowEmailBtn: document.getElementById('allowEmailBtn'),
  linkOwnerInput: document.getElementById('linkOwnerInput'),
  linkOwnerBtn: document.getElementById('linkOwnerBtn'),
  activeOwnerSelect: document.getElementById('activeOwnerSelect'),
  status: document.getElementById('status')
};

function setStatus(msg) {
  if (els.status) els.status.textContent = msg;
}

async function renderLinkedAccounts() {
  const user = auth.currentUser;
  if (!user || !els.activeOwnerSelect) return;
  const owners = await getLinkedOwnersForCurrentUser();
  // הוספת "אני" תמיד
  const options = [{ uid: user.uid, label: `אני (${user.email || user.uid})` }];
  owners.forEach(uid => options.push({ uid, label: `בעל חשבון: ${uid}` }));
  els.activeOwnerSelect.innerHTML = options.map(o => `<option value="${o.uid}">${o.label}</option>`).join('');
  // בחירת ברירת מחדל
  const defaultUid = activeOwnerUid || user.uid;
  els.activeOwnerSelect.value = defaultUid;
  setStatus(`חשבון פעיל: ${defaultUid}`);
}

// האזנת מצב התחברות
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await ensureOwnerProfile(user);
    if (!activeOwnerUid) activeOwnerUid = user.uid;
    renderLinkedAccounts();
    setStatus(`מחובר/ת: ${user.email || user.uid}`);
  } else {
    activeOwnerUid = null;
    if (els.activeOwnerSelect) els.activeOwnerSelect.innerHTML = '';
    setStatus('לא מחובר/ת');
  }
});

// אירועי UI
if (els.signupBtn) {
  els.signupBtn.addEventListener('click', async () => {
    try { await signupWithEmail(els.email.value, els.password.value); } catch (e) { alert(e.message); }
  });
}
if (els.loginEmailBtn) {
  els.loginEmailBtn.addEventListener('click', async () => {
    try { await loginWithEmail(els.email.value, els.password.value); } catch (e) { alert(e.message); }
  });
}
if (els.loginGoogleBtn) {
  els.loginGoogleBtn.addEventListener('click', async () => {
    try { await loginWithGoogle(); } catch (e) { alert(e.message); }
  });
}
if (els.logoutBtn) {
  els.logoutBtn.addEventListener('click', async () => {
    try { await logout(); } catch (e) { alert(e.message); }
  });
}
if (els.allowEmailBtn) {
  els.allowEmailBtn.addEventListener('click', async () => {
    try { await allowEmailForLink(els.allowEmailInput.value.trim()); alert('המייל אושר לקישור'); } catch (e) { alert(e.message); }
  });
}
if (els.linkOwnerBtn) {
  els.linkOwnerBtn.addEventListener('click', async () => {
    try { await linkToOwnerByEmail(els.linkOwnerInput.value.trim()); alert('החשבון קושר בהצלחה'); } catch (e) { alert(e.message); }
  });
}
if (els.activeOwnerSelect) {
  els.activeOwnerSelect.addEventListener('change', (e) => switchActiveOwner(e.target.value));
}
