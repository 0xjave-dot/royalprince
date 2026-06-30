import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (replace with your own values if needed)
const firebaseConfig = {
  apiKey: 'AIzaSyBbULfk2c-qWq8ymlQeW6NbAb2AdJqjSwU',
  authDomain: 'fabr-b9e7f.firebaseapp.com',
  projectId: 'fabr-b9e7f',
  storageBucket: 'fabr-b9e7f.firebasestorage.app',
  messagingSenderId: '615789646995',
  appId: '1:615789646995:web:9d786684a8268284102966',
  measurementId: 'G-ECQ6JHJYN0',
};

// Initialize Firebase app
export const firebaseApp = initializeApp(firebaseConfig);

// Export auth and firestore instances
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
