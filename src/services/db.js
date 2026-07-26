import { auth, db } from '../firebase/config';
import { 
  getCourses as fetchCoursesFromFirestore, 
  getCourseCount as fetchCountFromFirestore,
  saveCourse as saveCourseToFirestore, 
  deleteCourse as removeCourseFromFirestore,
  seedDefaultCoursesToFirestore,
  defaultCourses
} from './coursesService';

export const checkFirebaseStatus = () => !!db;
export const getFirebaseAuth = () => auth;

export const getCourses = async (category = 'todos') => {
  try {
    const data = await fetchCoursesFromFirestore(category);
    if (data && data.length > 0) return data;
    if (db) {
      const seeded = await seedDefaultCoursesToFirestore();
      if (seeded && seeded.length > 0) {
        return category && category !== 'todos'
          ? seeded.filter(c => c.category === category)
          : seeded;
      }
    }
    return defaultCourses;
  } catch (err) {
    console.warn("Conectando con almacenamiento local:", err);
    return defaultCourses;
  }
};

export const getCourseCount = async () => {
  try {
    return await fetchCountFromFirestore();
  } catch (err) {
    const cached = localStorage.getItem('cecati_course_count');
    return cached ? parseInt(cached, 10) : defaultCourses.length;
  }
};

export const saveCourse = async (course, imageFile = null) => {
  return await saveCourseToFirestore(course, imageFile);
};

export const deleteCourse = async (id, imageUrl = null) => {
  return await removeCourseFromFirestore(id, imageUrl);
};

// Re-exportación de Servicios de Blog y Noticias
export { 
  getPosts, 
  getAllPostsAdmin, 
  getPostByIdOrSlug, 
  savePost, 
  deletePost, 
  togglePostStatus 
} from './postsService';

// Re-exportación de Servicios de Testimonios
export {
  getTestimonials,
  getAllTestimonialsAdmin,
  saveTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus
} from './testimonialsService';

// Re-exportación de Servicio de Monitoreo de Almacenamiento
export { calculateStorageUsage } from './storageUsageService';
export { seedDefaultCoursesToFirestore } from './coursesService';




