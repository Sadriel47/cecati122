import { createContext, useContext, useState, useEffect } from 'react';
import { getFirebaseAuth, checkFirebaseStatus } from '../services/db';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isConnected = checkFirebaseStatus();

    if (isConnected) {
      const auth = getFirebaseAuth();
      if (auth) {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'ADMIN', // Firebase authenticated user assigned ADMIN role
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      }
    } else {
      // Local Storage session check for fallback
      const localSession = localStorage.getItem("cecati_admin_logged");
      if (localSession === "true") {
        setUser({
          uid: 'local-admin',
          email: 'admin@cecati122.edu.mx',
          role: 'ADMIN',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem("cecati_admin_logged");
    setUser(null);
  };

  const isAdmin = !!user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
