import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (replace with your own values if needed)
const firebaseConfig = {
  apiKey: 'AIzaSyBT4F8QKgRO-FEpWv3gUjFaJLJvpY-eNnU',
  authDomain: 'fashionp-cc2ee.firebaseapp.com',
  projectId: 'fashionp-cc2ee',
  storageBucket: 'fashionp-cc2ee.firebasestorage.app',
  messagingSenderId: '743241429640',
  appId: '1:743241429640:web:009d67e21adcabe04b653d',
  measurementId: 'G-L2JLCV9DE1',
};

// Initialize Firebase app
export const firebaseApp = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
