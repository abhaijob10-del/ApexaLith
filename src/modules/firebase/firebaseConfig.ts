import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default Firebase configuration (can be initialized with environment or default project credentials)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForApexaLithStudio2026",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "apexalith-digitaltwin.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "apexalith-digitaltwin",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "apexalith-digitaltwin.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
