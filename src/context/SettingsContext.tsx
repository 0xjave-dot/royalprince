import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { getUserDoc, initUserDoc, FirestoreUserProfile } from "../lib/firestore";
import {
  DEFAULT_USER_ACCOUNT,
  UserAccountDoc,
  UserSettingsDoc,
  ensureUserAccountDoc,
  setUserAccountDoc,
} from "../lib/userAccount";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  avatarUrl: string;
}

const EMPTY_PROFILE: UserProfile = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  avatarUrl: "",
};

interface SettingsContextType {
  sizeUnit: "UK" | "EU" | "US";
  setSizeUnit: (unit: "UK" | "EU" | "US") => void;
  currency: "NGN" | "USD" | "EUR" | "GBP";
  setCurrency: (curr: "NGN" | "USD" | "EUR" | "GBP") => void;
  language: string;
  setLanguage: (lang: string) => void;
  country: string;
  setCountry: (country: string) => void;
  mySize: string;
  setMySize: (size: string) => void;
  myShoeSize: string;
  setMyShoeSize: (size: string) => void;
  pushNotifications: boolean;
  setPushNotifications: (enabled: boolean) => void;
  currencySymbol: string;
  firebaseUser: User | null;
  authLoading: boolean;
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  account: UserAccountDoc;
  updateAccount: (next: UserAccountDoc) => void;
  signOut: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function currencyToSymbol(currency: UserSettingsDoc["currency"]): string {
  switch (currency) {
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "NGN":
    default:
      return "₦";
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [account, setAccount] = useState<UserAccountDoc>(DEFAULT_USER_ACCOUNT);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setUserProfile(EMPTY_PROFILE);
        setAccount(DEFAULT_USER_ACCOUNT);
        setAuthLoading(false);
        return;
      }

      try {
        const [profileDoc, loadedAccount] = await Promise.all([
          getUserDoc(user.uid),
          ensureUserAccountDoc(user.uid),
        ]);

        if (profileDoc) {
          setUserProfile({
            name: profileDoc.name || user.displayName || "",
            email: profileDoc.email || user.email || "",
            phone: profileDoc.phone || user.phoneNumber || "",
            dob: profileDoc.dob || "",
            gender: profileDoc.gender || "",
            avatarUrl: profileDoc.avatarUrl || user.photoURL || "",
          });
        } else {
          const profile: FirestoreUserProfile = {
            name: user.displayName || "",
            email: user.email || "",
            phone: user.phoneNumber || "",
            dob: "",
            gender: "",
            avatarUrl: user.photoURL || "",
          };
          await initUserDoc(user.uid, profile);
          setUserProfile(profile);
        }

        setAccount(loadedAccount);
      } catch (err) {
        console.warn("Firestore read failed, using Auth data:", err);
        setUserProfile({
          name: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          dob: "",
          gender: "",
          avatarUrl: user.photoURL || "",
        });
        setAccount(DEFAULT_USER_ACCOUNT);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const persistAccount = async (nextAccount: UserAccountDoc) => {
    setAccount(nextAccount);
    if (!firebaseUser) {
      return;
    }

    await setUserAccountDoc(firebaseUser.uid, nextAccount);
  };

  const clearClientState = () => {
    setUserProfile(EMPTY_PROFILE);
    setAccount(DEFAULT_USER_ACCOUNT);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    clearClientState();
    setFirebaseUser(null);
  };

  const {
    sizeUnit,
    currency,
    language,
    country,
    mySize,
    myShoeSize,
    pushNotifications,
  } = account.settings;

  const value = useMemo(
    () => ({
      sizeUnit,
      setSizeUnit: (unit: "UK" | "EU" | "US") => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, sizeUnit: unit },
        });
      },
      currency,
      setCurrency: (curr: "NGN" | "USD" | "EUR" | "GBP") => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, currency: curr },
        });
      },
      language,
      setLanguage: (lang: string) => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, language: lang },
        });
      },
      country,
      setCountry: (nextCountry: string) => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, country: nextCountry },
        });
      },
      mySize,
      setMySize: (size: string) => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, mySize: size },
        });
      },
      myShoeSize,
      setMyShoeSize: (size: string) => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, myShoeSize: size },
        });
      },
      pushNotifications,
      setPushNotifications: (enabled: boolean) => {
        void persistAccount({
          ...account,
          settings: { ...account.settings, pushNotifications: enabled },
        });
      },
      currencySymbol: currencyToSymbol(currency),
      firebaseUser,
      authLoading,
      userProfile,
      setUserProfile: (profile: UserProfile) => {
        setUserProfile(profile);
      },
      account,
      updateAccount: (next: UserAccountDoc) => {
        void persistAccount(next);
      },
      signOut,
    }),
    [
      account,
      authLoading,
      country,
      currency,
      firebaseUser,
      language,
      myShoeSize,
      mySize,
      pushNotifications,
      signOut,
      userProfile,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
