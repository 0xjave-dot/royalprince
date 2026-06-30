/**
 * Re-exports auth from the central firebase.ts to avoid duplicate instances.
 * Use `useSettings().firebaseUser` for reactive auth state in components.
 */
export { auth } from './firebase';

// useAuth is kept for backwards compatibility in App.tsx route guards.
// It reads directly from firebase.auth so it's always in sync.
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { useEffect, useState } from 'react';

export function useAuth(): { user: User | null; loading: boolean } {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
