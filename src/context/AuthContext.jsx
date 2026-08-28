import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFirebaseAuth, checkFirebaseStatus } from '../services/db';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiredNotice, setSessionExpiredNotice] = useState(false);

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
              role: 'ADMIN',
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      }
    } else {
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

  const logout = useCallback(async (reason = null) => {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Error al cerrar sesión en Firebase:", err);
      }
    }
    localStorage.removeItem("cecati_admin_logged");
    setUser(null);

    if (reason === 'inactivity') {
      setSessionExpiredNotice(true);
    }
  }, []);

  // Expiración por inactividad a los 30 minutos de inactividad
  useIdleTimeout(
    () => {
      logout('inactivity');
    },
    30 * 60 * 1000,
    !!user
  );

  const clearSessionNotice = () => setSessionExpiredNotice(false);

  const isAdmin = !!user && user.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout, setUser, sessionExpiredNotice, clearSessionNotice }}>
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
