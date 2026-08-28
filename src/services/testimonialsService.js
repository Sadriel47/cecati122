import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
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

export const defaultTestimonials = [];

export async function seedDefaultTestimonialsToFirestore() {
  return [];
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
 * Elimina un avatar de testimonio de Firebase Storage
 */
export async function deleteTestimonialAvatar(storagePathOrUrl) {
  if (!storagePathOrUrl) return;

  try {
    const imageRef = ref(storage, storagePathOrUrl);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn("No se pudo eliminar el avatar del testimonio:", err.message);
  }
}

/**
 * Obtiene testimonios publicados para la vista pública
 */
export async function getTestimonials() {
  try {
    const refCol = collection(db, TESTIMONIALS_COLLECTION);
    const q = query(refCol, where('status', '==', 'published'));

    const querySnapshot = await getDocs(q);
    const list = [];
    querySnapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() });
    });

    return list;
  } catch (error) {
    console.error("Error al obtener testimonios desde Firestore:", error);
    return [];
  }
}

/**
 * Obtiene todos los testimonios para el panel administrativo
 */
export async function getAllTestimonialsAdmin() {
  try {
    const refCol = collection(db, TESTIMONIALS_COLLECTION);
    const querySnapshot = await getDocs(refCol);
    const list = [];
    querySnapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() });
    });

    return list;
  } catch (error) {
    console.warn("Error cargando testimonios en modo admin:", error);
    return [];
  }
}

/**
 * Guarda (crea o actualiza) un testimonio en Firestore
 */
export async function saveTestimonial(testimonialData, avatarFile = null) {
  try {
    let avatarUrl = testimonialData.avatar || '';

    if (avatarFile) {
      const uploadResult = await uploadTestimonialAvatar(avatarFile);
      avatarUrl = uploadResult.url;
    }

    const payload = {
      studentName: testimonialData.studentName,
      roleOrCourse: testimonialData.roleOrCourse || 'Alumno',
      title: testimonialData.title || '',
      comment: testimonialData.comment || '',
      rating: Number(testimonialData.rating) || 5,
      avatar: avatarUrl || '/assets/img/testimonial-profile-1.png',
      status: testimonialData.status || 'published',
      updatedAt: serverTimestamp(),
    };

    if (testimonialData.id) {
      const docRef = doc(db, TESTIMONIALS_COLLECTION, testimonialData.id);
      await updateDoc(docRef, payload);
      return { id: testimonialData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), payload);
      return { id: docRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar testimonio en Firestore:", error);
    throw error;
  }
}

/**
 * Elimina un testimonio de Firestore
 */
export async function deleteTestimonial(id, avatarUrl = null) {
  try {
    if (avatarUrl && avatarUrl.includes('firebasestorage')) {
      await deleteTestimonialAvatar(avatarUrl);
    }
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar testimonio de Firestore:", error);
    throw error;
  }
}

/**
 * Cambia el estado (published / draft) de un testimonio
 */
export async function toggleTestimonialStatus(id, currentStatus) {
  try {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const docRef = doc(db, TESTIMONIALS_COLLECTION, id);
    await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
    return newStatus;
  } catch (error) {
    console.error("Error al cambiar estado de testimonio:", error);
    throw error;
  }
}
