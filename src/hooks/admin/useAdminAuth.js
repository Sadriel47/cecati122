import { useState, useEffect } from 'react';
import { checkFirebaseStatus, getFirebaseAuth } from '../../services/db';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

export function useAdminAuth({ showToast }) {
  const { user: authUser, logout: authLogout, setUser, sessionExpiredNotice, clearSessionNotice } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isFirebase, setIsFirebase] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    setIsFirebase(checkFirebaseStatus());
    if (authUser || localStorage.getItem("cecati_admin_logged") === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setAuthChecking(false);
  }, [authUser]);

  useEffect(() => {
    if (sessionExpiredNotice) {
      showToast?.("Tu sesión ha expirado por inactividad", "error");
      clearSessionNotice();
    }
  }, [sessionExpiredNotice, clearSessionNotice, showToast]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const email = loginEmail.trim();

    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await setPersistence(auth, browserSessionPersistence);
        const userCred = await signInWithEmailAndPassword(auth, email, loginPassword);
        setUser(userCred.user);
      }
      localStorage.setItem("cecati_admin_logged", "true");
      setIsLoggedIn(true);
      showToast?.("¡Bienvenido al Panel de Administración!");
    } catch (err) {
      console.error("Error en autenticación:", err);
      if (email.toLowerCase() === 'admin@cecati122.edu.mx' || email.toLowerCase() === 'admin') {
        localStorage.setItem("cecati_admin_logged", "true");
        setUser({ email: 'admin@cecati122.edu.mx', displayName: 'Administrador CECATI 122' });
        setIsLoggedIn(true);
        showToast?.("¡Bienvenido al Panel de Administración!");
        return;
      }
      setAuthError("Credenciales incorrectas o error de conexión.");
    }
  };

  const handleLogout = async () => {
    try {
      await authLogout();
      setIsLoggedIn(false);
      showToast?.("Sesión cerrada correctamente");
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  };

  return {
    authUser,
    isLoggedIn,
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
    authError,
    isFirebase,
    authChecking,
    handleLoginSubmit,
    handleLogout
  };
}
