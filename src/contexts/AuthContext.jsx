import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';

const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in failed:', err.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Sign-out failed:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
