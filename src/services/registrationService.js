import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc,
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const REGISTRATIONS_COLLECTION = 'preRegistrations';

// Ejemplos por defecto para solicitudes de pre-registro iniciales
export const defaultRegistrations = [
  {
    id: "reg_alejandro_morales",
    fullName: "Alejandro Morales Mendoza",
    phone: "4421234567",
    email: "alejandro.morales@gmail.com",
    courseId: "informatica",
    courseTitle: "Informática",
    status: "PENDIENTE",
    createdAt: "2026-07-24T14:30:00Z"
  },
  {
    id: "reg_sofia_ramirez",
    fullName: "Sofía Ramírez Castro",
    phone: "4429876543",
    email: "sofia.ramirez@hotmail.com",
    courseId: "confeccion",
    courseTitle: "Confección y Preformado de Prendas",
    status: "CONTACTADO",
    createdAt: "2026-07-25T10:15:00Z"
  },
  {
    id: "reg_fernando_torres",
    fullName: "Fernando Torres Gutiérrez",
    phone: "4425558899",
    email: "fernando.torres@outlook.com",
    courseId: "informatica",
    courseTitle: "Informática",
    status: "INSCRITO",
    createdAt: "2026-07-25T16:45:00Z"
  }
];

/**
 * Inserta los registros de ejemplo en la colección Firestore.
 * @returns {Promise<Array<Object>>}
 */
export async function seedDefaultRegistrationsToFirestore() {
  if (!db) return defaultRegistrations;
  try {
    const seeded = [];
    for (const reg of defaultRegistrations) {
      const docRef = doc(db, REGISTRATIONS_COLLECTION, reg.id);
      const payload = {
        ...reg,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, payload, { merge: true });
      seeded.push(payload);
    }
    console.log("Pre-registros de ejemplo insertados exitosamente en Firestore.");
    return seeded;
  } catch (err) {
    console.error("Error al sembrar pre-registros en Firestore:", err);
    return defaultRegistrations;
  }
}

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
 * Obtiene todas las solicitudes de pre-registro para el panel administrativo desde Firestore.
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

    return registrations;
  } catch (error) {
    console.warn("Error al obtener pre-registros de Firestore:", error);
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
