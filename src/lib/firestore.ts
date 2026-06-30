import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface FirestoreUserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  avatarUrl: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

/** Create (or merge) a user doc on first sign-in */
export async function initUserDoc(uid: string, data: Partial<FirestoreUserProfile>): Promise<void> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) return;

  // For a clean newly-created profile, only store provided values.
  // Any missing values will be persisted as empty strings.
  await setDoc(ref, {
    name: data.name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    dob: data.dob ?? '',
    gender: data.gender ?? '',
    avatarUrl: data.avatarUrl ?? '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}


/** Read a user doc */
export async function getUserDoc(uid: string): Promise<FirestoreUserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) {
    return snap.data() as FirestoreUserProfile;
  }
  return null;
}

/** Patch specific fields in a user doc */
export async function updateUserDoc(uid: string, data: Partial<FirestoreUserProfile>): Promise<void> {
  const ref = doc(db, 'users', uid);
  await setDoc(
    ref,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
