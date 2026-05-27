import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile } from '../types';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface StateContextType {
  cart: CartItem[];
  wishlist: string[];
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  stylistOpen: boolean;
  setStylistOpen: (open: boolean) => void;
  userProfile: UserProfile | null;
  loadingAuth: boolean;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  syncProfile: () => Promise<void>;
  pointsEarned: number;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('fab_ruby_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('fab_ruby_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [stylistOpen, setStylistOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('fab_ruby_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fab_ruby_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Firebase auth state hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setLoadingAuth(true);
      if (user) {
        // Fetch or create customer profile in firestore
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            setUserProfile(profileData);
            if (profileData.wishlist) {
              setWishlist(profileData.wishlist);
            }
          } else {
            const initialProfile: UserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'Fashion Lover',
              loyaltyPoints: 0,
              savedAddresses: [],
              wishlist: wishlist
            };
            await setDoc(docRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (error) {
          console.error("Error reading/syncing user profile: ", error);
          // Local fallback in case of firebase read errors or sandbox network offline
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Fashion Lover',
            loyaltyPoints: 120, // Give some points as warm greeting
            wishlist: wishlist
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const syncProfile = async () => {
    if (!auth.currentUser || !userProfile) return;
    const docRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(docRef, {
        loyaltyPoints: userProfile.loyaltyPoints,
        wishlist: wishlist
      });
    } catch (e) {
      console.warn("Could not sync online profile, local profile updated instead.", e);
    }
  };

  const addToCart = (product: Product, size: string, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex(item => item.product.id === product.id && item.selectedSize === size);
      if (idx > -1) {
        const cloned = [...prev];
        cloned[idx].quantity += quantity;
        return cloned;
      }
      return [...prev, { product, selectedSize: size, quantity }];
    });
    // Trigger drawer on add cart
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) => {
      const idx = prev.findIndex(item => item.product.id === productId && item.selectedSize === size);
      if (idx > -1) {
        const cloned = [...prev];
        cloned[idx].quantity = quantity;
        return cloned;
      }
      return prev;
    });
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(productId);
      const next = isSaved ? prev.filter(id => id !== productId) : [...prev, productId];
      
      // Sync up to User Profile if authenticated
      if (userProfile) {
        setUserProfile(curr => curr ? { ...curr, wishlist: next } : null);
      }
      return next;
    });
  };

  // Sync wishlist to Firestore whenever it updates
  useEffect(() => {
    if (userProfile && auth.currentUser) {
      syncProfile();
    }
  }, [wishlist]);

  // Calculate accumulated points earned in cart
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pointsEarned = Math.floor(subtotal / 1000);

  return (
    <StateContext.Provider value={{
      cart,
      wishlist,
      searchOpen,
      setSearchOpen,
      cartOpen,
      setCartOpen,
      stylistOpen,
      setStylistOpen,
      userProfile,
      loadingAuth,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      syncProfile,
      pointsEarned
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) throw new Error("useAppState must be used within StateProvider");
  return context;
};
