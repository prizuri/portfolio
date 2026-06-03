/**
 * LANGKAH SETUP FIREBASE (5 menit, gratis):
 *
 * 1. Buka https://console.firebase.google.com
 * 2. Klik "Add project" → beri nama (misal: "prizuri-portfolio")
 * 3. Nonaktifkan Google Analytics (opsional) → Create project
 * 4. Di sidebar kiri → Build → Authentication → Get started → Email/Password → Enable
 * 5. Authentication → Users → Add user → masukkan email & password admin-mu
 * 6. Build → Firestore Database → Create database → Start in production mode → pilih lokasi
 * 7. Build → Storage → Get started → Start in production mode
 * 8. Project Settings (gear icon) → General → scroll ke bawah
 *    → "Your apps" → klik ikon </> (Web) → daftarkan app → copy firebaseConfig
 * 9. Ganti nilai di bawah ini dengan config-mu
 * 10. Firestore Rules → ganti dengan rules di bawah
 * 11. Storage Rules → ganti dengan rules di bawah
 *
 * ─── FIRESTORE RULES (paste di Firestore → Rules) ────────────────
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /{document=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 *
 * ─── STORAGE RULES (paste di Storage → Rules) ────────────────────
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *     match /{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth != null;
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

// Jangan ubah kode di bawah ini
firebase.initializeApp(firebaseConfig);
const db      = firebase.firestore();
const auth    = firebase.auth();
const storage = firebase.storage();
