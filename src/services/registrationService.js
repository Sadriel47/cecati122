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

const REGISTRATIONS_COLLECTION = 'preRegistrations';

/**
 * Registra una solicitud de pre-inscripción de un alumno en Firestore.
 * @param {Object} registrationData 
 * @returns {Promise<Object>}
 */
export async function createPreRegistration(registrationData) {
  try {
    const payload = {
      fullName: registrationData.fullName,
      phone: registrationData.phone,
      email: registrationData.email || '',
      courseId: registrationData.courseId || '',
      courseTitle: registrationData.courseTitle || '',
      status: 'PENDIENTE', // PENDIENTE | CONTACTADO | INSCRITO
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error al registrar pre-inscripción en Firestore:", error);
    // Fallback a LocalStorage en caso de estar offline
    const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
    const newReg = {
      id: 'local_' + Date.now(),
      ...registrationData,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString()
    };
    local.push(newReg);
    localStorage.setItem('cecati_preregistrations', JSON.stringify(local));
    return newReg;
  }
}

/**
 * Obtiene todas las solicitudes de pre-registro para el panel administrativo.
 * @returns {Promise<Array<Object>>}
 */
export async function getPreRegistrations() {
  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const registrations = [];
    snapshot.forEach((docSnap) => {
      registrations.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (registrations.length === 0) {
      const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
      return local;
    }

    return registrations;
  } catch (error) {
    console.warn("Obteniendo pre-registros locales:", error);
    const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
    return local;
  }
}

/**
 * Actualiza el estado de una solicitud de pre-registro (PENDIENTE -> CONTACTADO -> INSCRITO).
 * @param {string} id 
 * @param {string} status 
 * @returns {Promise<boolean>}
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
