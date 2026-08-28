import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { sanitizeInput, validateRegistrationSchema, rateLimitCheck, recordRegistrationTimestamp } from '../utils/securityUtils';

const REGISTRATIONS_COLLECTION = 'preRegistrations';

export const defaultRegistrations = [];

export async function seedDefaultRegistrationsToFirestore() {
  return [];
}

/**
 * Registra una solicitud de pre-inscripción de un alumno en Firestore.
 * @param {Object} registrationData 
 * @returns {Promise<Object>}
 */
export async function createPreRegistration(registrationData) {
  if (!rateLimitCheck('pre_registration', 3000)) {
    throw new Error("Por favor espera unos segundos antes de enviar otra solicitud.");
  }

  const rawPhone = (registrationData.phone || '').replace(/\D/g, '');

  const sanitizedData = {
    fullName: sanitizeInput(registrationData.fullName),
    phone: rawPhone,
    email: sanitizeInput(registrationData.email).toLowerCase(),
    courseId: sanitizeInput(registrationData.courseId),
    courseTitle: sanitizeInput(registrationData.courseTitle),
  };

  const validation = validateRegistrationSchema(sanitizedData);
  if (!validation.isValid) {
    throw new Error(validation.errors[0]);
  }

  try {
    const payload = {
      ...sanitizedData,
      phone: validation.cleanPhone,
      status: 'PENDIENTE',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), payload);
    recordRegistrationTimestamp();
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error al registrar pre-inscripción en Firestore:", error);
    const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
    const newReg = {
      id: 'local_' + Date.now(),
      ...sanitizedData,
      phone: validation.cleanPhone,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString()
    };
    local.unshift(newReg);
    localStorage.setItem('cecati_preregistrations', JSON.stringify(local));
    recordRegistrationTimestamp();
    return newReg;
  }
}

/**
 * Obtiene todas las solicitudes de pre-registro para el panel administrativo desde Firestore.
 * @returns {Promise<Array<Object>>}
 */
export async function getRegistrations() {
  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const registrations = [];
    querySnapshot.forEach((docSnap) => {
      registrations.push({ id: docSnap.id, ...docSnap.data() });
    });

    // Combinar con solicitudes guardadas localmente en offline
    const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
    const combined = [...registrations, ...local];

    return combined;
  } catch (error) {
    console.error("Error al obtener solicitudes de pre-registro:", error);
    const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
    return local;
  }
}

export const getPreRegistrations = getRegistrations;

/**
 * Actualiza el estado de una solicitud de pre-registro (PENDIENTE -> CONTACTADO -> INSCRITO).
 * @param {string} id 
 * @param {string} status 
 */
export async function updateRegistrationStatus(id, status) {
  try {
    if (id.startsWith('local_')) {
      const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
      const idx = local.findIndex(r => r.id === id);
      if (idx > -1) {
        local[idx].status = status;
        localStorage.setItem('cecati_preregistrations', JSON.stringify(local));
      }
      return true;
    }

    const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error("Error al actualizar estado de pre-registro:", error);
    throw error;
  }
}
