import { useEffect, useRef } from 'react';

/**
 * Custom Hook para detectar inactividad del usuario en la aplicación y ejecutar una acción (como cerrar sesión).
 * @param {Function} onIdle Callback ejecutado al vencer el tiempo de inactividad
 * @param {number} idleTimeMs Tiempo de inactividad en milisegundos (por defecto 30 minutos = 1,800,000 ms)
 * @param {boolean} active Activa el listener únicamente cuando existe un usuario autenticado
 */
export function useIdleTimeout(onIdle, idleTimeMs = 30 * 60 * 1000, active = true) {
  const timerRef = useRef(null);
  const onIdleRef = useRef(onIdle);

  useEffect(() => {
    onIdleRef.current = onIdle;
  }, [onIdle]);

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (onIdleRef.current) {
          onIdleRef.current();
        }
      }, idleTimeMs);
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }));

    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [idleTimeMs, active]);
}
