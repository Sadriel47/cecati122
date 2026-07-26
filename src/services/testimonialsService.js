import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const TESTIMONIALS_COLLECTION = 'testimonials';

// Testimonios semilla por defecto (fallback local/offline)
export const defaultTestimonials = [
  {
    id: "testimonio-maria-hernandez",
    studentName: "María Hernández",
    roleOrCourse: "Egresada de Confección",
    title: "Abrí mi propio taller de costura",
    comment: "Gracias al CECATI 122 aprendí patronaje avanzado y confección. Las clases son prácticas y los docentes están siempre dispuestos a asesorarte.",
    rating: 5,
    avatar: "/assets/img/testimonial-profile-1.png",
    status: "published",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "testimonio-juan-carlos-perez",
    studentName: "Juan Carlos Pérez",
    roleOrCourse: "Alumno de Informática",
    title: "Conseguí trabajo de Soporte Técnico",
    comment: "El certificado con validez oficial SEP me abrió las puertas en una empresa de tecnología. Aprendí redes e informática aplicada desde cero.",
    rating: 5,
    avatar: "/assets/img/testimonial-profile-1.png",
    status: "published",
    createdAt: "2026-07-05T12:00:00Z"
  },
  {
    id: "testimonio-gerardo-cruz",
    studentName: "Gerardo Cruz",
    roleOrCourse: "Alumno de Electromecánica",
    title: "Excelente nivel de instructores",
    comment: "Es una gran institución con validez oficial. Aprendí a reparar motores y diagnosticar fallas eléctricas de forma completamente práctica.",
    rating: 5,
    avatar: "/assets/img/testimonial-profile-1.png",
    status: "published",
    createdAt: "2026-07-10T14:00:00Z"
  }
];

/**
 * Inserta los testimonios por defecto en la colección Firestore.
 * @returns {Promise<Array<Object>>}
 */
export async function seedDefaultTestimonialsToFirestore() {
  if (!db) return defaultTestimonials;
  try {
    const seeded = [];
    for (const item of defaultTestimonials) {
      const docRef = doc(db, TESTIMONIALS_COLLECTION, item.id);
      const payload = {
        ...item,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, payload, { merge: true });
      seeded.push(payload);
    }
    console.log("Testimonios de ejemplo insertados exitosamente en Firestore.");
    return seeded;
  } catch (err) {
    console.error("Error al sembrar testimonios en Firestore:", err);
    return defaultTestimonials;
  }
}

/**
 * Sube la foto/avatar de un estudiante a Firebase Storage
 */
export async function uploadTestimonialAvatar(file) {
  if (!file) return { url: '', path: '' };

  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `testimonials/${timestamp}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    path: storagePath,
  };
}

/**
 * Elimina la foto de avatar de Firebase Storage
 */
export async function deleteTestimonialAvatar(storagePathOrUrl) {
  if (!storagePathOrUrl || storagePathOrUrl.includes('assets/img')) return;

  try {
    const imageRef = ref(storage, storagePathOrUrl);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn("No se pudo eliminar el avatar del testimonio de Storage:", err.message);
  }
}

/**
 * Obtiene los testimonios públicos activos (solo estado 'published')
 */
export async function getTestimonials() {
  try {
    if (!db) return [];

    const colRef = collection(db, TESTIMONIALS_COLLECTION);
    const querySnapshot = await getDocs(colRef);
    
    let testimonials = [];
    querySnapshot.forEach((docSnap) => {
      testimonials.push({ id: docSnap.id, ...docSnap.data() });
    });

    return testimonials.filter(t => t.status === 'published');
  } catch (error) {
    console.warn("Error al cargar testimonios de Firestore:", error);
    return [];
  }
}

/**
 * Obtiene todos los testimonios para el panel administrativo (publicados y borradores)
 */
export async function getAllTestimonialsAdmin() {
  try {
    if (!db) return [];

    const colRef = collection(db, TESTIMONIALS_COLLECTION);
    const querySnapshot = await getDocs(colRef);

    let testimonials = [];
    querySnapshot.forEach((docSnap) => {
      testimonials.push({ id: docSnap.id, ...docSnap.data() });
    });

    return testimonials;
  } catch (error) {
    console.warn("Error al cargar testimonios para admin:", error);
    return [];
  }
}

/**
 * Guarda (crea o actualiza) un testimonio en Firestore
 */
export async function saveTestimonial(testimonialData, avatarFile = null) {
  try {
    let finalAvatarUrl = testimonialData.avatar || '';

    if (avatarFile) {
      const uploadRes = await uploadTestimonialAvatar(avatarFile);
      finalAvatarUrl = uploadRes.url;
    }

    const payload = {
      studentName: testimonialData.studentName.trim(),
      roleOrCourse: testimonialData.roleOrCourse || 'Estudiante CECATI 122',
      title: testimonialData.title || '',
      comment: testimonialData.comment || '',
      rating: Number(testimonialData.rating) || 5,
      avatar: finalAvatarUrl || '/assets/img/testimonial-profile-1.png',
      status: testimonialData.status || 'published',
      updatedAt: serverTimestamp(),
    };

    if (testimonialData.id) {
      const docRef = doc(db, TESTIMONIALS_COLLECTION, testimonialData.id);
      await updateDoc(docRef, payload);
      return { id: testimonialData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const customId = `testimonio_${Date.now()}`;
      const customDocRef = doc(db, TESTIMONIALS_COLLECTION, customId);
      await setDoc(customDocRef, payload);
      return { id: customDocRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar testimonio en Firestore:", error);
    throw error;
  }
}

/**
 * Cambia el estado de un testimonio entre 'published' y 'draft'
 */
export async function toggleTestimonialStatus(id, currentStatus) {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
  await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
  return newStatus;
}

/**
 * Elimina un testimonio de Firestore
 */
export async function deleteTestimonial(id) {
  try {
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar testimonio:", error);
    throw error;
  }
}
