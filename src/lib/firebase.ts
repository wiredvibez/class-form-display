import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCRrCOwf7AFpG8joYX8-vcLO_xj2Blib_U",
  authDomain: "university-projects-d331c.firebaseapp.com",
  projectId: "university-projects-d331c",
  storageBucket: "university-projects-d331c.firebasestorage.app",
  messagingSenderId: "1040676805336",
  appId: "1:1040676805336:web:110272604f330f7fa655ad"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };

