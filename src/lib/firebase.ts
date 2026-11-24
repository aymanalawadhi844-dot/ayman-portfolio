import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// إعدادات Firebase للويب — هذه القيم عامة بطبيعتها (تُضمَّن في كود الموقع
// المنشور للزوار) والحماية الحقيقية تكون عبر Firestore/Storage Rules.
// يمكن تجاوزها عبر متغيرات VITE_FIREBASE_* في .env عند الحاجة.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBHrmireEloR9MylGxbcIVp7rKSmRR-i9s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'profile-1-c5316.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'profile-1-c5316',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'profile-1-c5316.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '86233257545',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:86233257545:web:77f60268a589d5bf485198',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const firebaseApp = isFirebaseConfigured
  ? initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;
