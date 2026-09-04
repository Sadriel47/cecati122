/**
 * Utilidades de seguridad: Sanitización contra XSS, validación de esquemas y rate limiting en cliente.
 */

const lastActionTimes = {};

/**
 * Previene envíos masivos seguidos (Debouncing / Throttling Anti-Spam en cliente).
 * @param {string} actionKey Clave identificadora de la acción (ej. 'save_course')
 * @param {number} cooldownMs Tiempo mínimo en ms entre envíos (por defecto 2000 ms)
 * @returns {boolean} true si está permitido, false si se bloquea por spam
 */
export function rateLimitCheck(actionKey, cooldownMs = 2000) {
  const now = Date.now();
  const lastTime = lastActionTimes[actionKey] || 0;
  if (now - lastTime < cooldownMs) {
    return false;
  }
  lastActionTimes[actionKey] = now;
  return true;
}

/**
 * Verifica el tiempo de enfriamiento (45 segundos) entre pre-registros en el mismo dispositivo.
 */
export function checkRegistrationCooldown(cooldownSeconds = 45) {
  const lastTs = localStorage.getItem('last_preregistro_ts');
  if (lastTs) {
    const elapsed = (Date.now() - parseInt(lastTs, 10)) / 1000;
    if (elapsed < cooldownSeconds) {
      const remaining = Math.ceil(cooldownSeconds - elapsed);
      return { allowed: false, remaining };
    }
  }
  return { allowed: true, remaining: 0 };
}

/**
 * Registra la marca de tiempo del último pre-registro exitoso.
 */
export function recordRegistrationTimestamp() {
  localStorage.setItem('last_preregistro_ts', String(Date.now()));
}

/**
 * Limpia y escapa cadenas de texto contra ataques Cross-Site Scripting (XSS).
 * @param {string} input 
 * @returns {string} Cadena limpia y escapada
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * Valida formato de correo electrónico.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

/**
 * Valida el esquema de datos de un curso antes de enviarse a la base de datos.
 */
export function validateCourseSchema(data) {
  const errors = [];

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push("El título del curso debe tener al menos 3 caracteres.");
  } else if (data.title.length > 150) {
    errors.push("El título no puede exceder 150 caracteres.");
  }

  if (data.shift !== undefined && typeof data.shift !== 'string') {
    errors.push("El turno debe ser un texto (Matutino, Vespertino, Sabatino, etc.).");
  }

  if (data.instructor !== undefined && typeof data.instructor !== 'string') {
    errors.push("El nombre del profesor(a) debe ser una cadena de texto.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valida el esquema de pre-registro de alumnos (Nombre 3-80 caracteres, teléfono exactamente 10 dígitos, correo opcional).
 */
export function validateRegistrationSchema(data) {
  const errors = [];

  const fullName = (data.fullName || '').trim();
  if (!fullName || fullName.length < 3 || fullName.length > 80) {
    errors.push("El nombre completo debe tener entre 3 y 80 caracteres.");
  }

  const cleanPhone = (data.phone || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length !== 10) {
    errors.push("El teléfono debe constar de exactamente 10 dígitos numéricos.");
  }

  const email = (data.email || '').trim().toLowerCase();
  if (email.length > 0 && !isValidEmail(email)) {
    errors.push("Ingresa una dirección de correo electrónico válida.");
  }

  return {
    isValid: errors.length === 0,
    cleanPhone,
    errors
  };
}
