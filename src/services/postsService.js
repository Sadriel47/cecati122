import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const POSTS_COLLECTION = 'posts';

// Publicaciones semilla para fallback local o primera hidratación
export const defaultPosts = [
  {
    id: "inicio-inscripciones-trimestre-2026",
    title: "Apertura de Inscripciones para el Próximo Período Escolar",
    slug: "inicio-inscripciones-trimestre-2026",
    excerpt: "El CECATI 122 abre su proceso de inscripción para los nuevos cursos y talleres de formación para el trabajo. Conoce los requisitos y fechas clave.",
    content: `Nos complace anunciar la apertura del proceso de inscripciones para nuestro próximo período de capacitación técnica profesional en el CECATI 122. 

Ofrecemos cursos prácticos en diversas especialidades con alta demanda laboral como Informática, Confección de Prendas, Electricidad, Mecánica Automotriz y Belleza. Todos nuestros cursos cuentan con certificación oficial otorgada por la Secretaría de Educación Pública (SEP).

### Requisitos de Inscripción:
1. Copia de CURP actualizada.
2. Copia del Acta de Nacimiento.
3. Comprobante del último grado de estudios.
4. Identificación oficial con fotografía (o del tutor en caso de menores de edad).
5. Comprobante de pago de cuota de recuperación.

### Horarios de Atención en Plantel:
De Lunes a Viernes de 8:00 AM a 6:00 PM en el área de Servicios Escolares.

¡Invierte en tu futuro y adquiere habilidades prácticas que impulsarán tu crecimiento profesional!`,
    category: "Avisos Importantes",
    featuredImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop",
    author: "Servicios Escolares",
    status: "published",
    pinned: true,
    publishedAt: "2026-07-20",
    createdAt: "2026-07-20T10:00:00Z",
    tags: ["Inscripciones", "SEP", "Cursos", "CECATI 122"]
  },
  {
    id: "inauguracion-nuevo-taller-computo",
    title: "Inauguración de las Nuevas Instalaciones del Taller de Cómputo",
    slug: "inauguracion-nuevo-taller-computo",
    excerpt: "Renovamos nuestros laboratorios informáticos con tecnología de última generación para mejorar el aprendizaje técnico de nuestros estudiantes.",
    content: `Como parte de nuestro compromiso constante con la excelencia educativa y la modernización de nuestras herramientas didácticas, la Dirección del CECATI 122 llevó a cabo la inauguración oficial del renovado Laboratorio de Informática.

Este nuevo espacio cuenta con equipos de alto rendimiento, conexión de fibra óptica de alta velocidad y software actualizado para el desarrollo de competencias en ofimática avanzada, diseño web, desarrollo de software y soporte técnico.

La ceremonia contó con la presencia de autoridades educativas, personal docente y representantes del sector empresarial local, quienes destacaron la importancia de vincular la educación técnica con las necesidades reales del mercado laboral actual.`,
    category: "Noticias Generales",
    featuredImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
    author: "Dirección CECATI 122",
    status: "published",
    pinned: false,
    publishedAt: "2026-07-15",
    createdAt: "2026-07-15T12:30:00Z",
    tags: ["Tecnología", "Infraestructura", "Innovación"]
  },
  {
    id: "feria-empleo-vinculacion-laboral-2026",
    title: "Gran Feria de Empleo y Vinculación Laboral en CECATI 122",
    slug: "feria-empleo-vinculacion-laboral-2026",
    excerpt: "Más de 20 empresas de la región se darán cita en nuestro plantel para reclutar talento formado en nuestras aulas. ¡Prepara tu currículum!",
    content: `Te invitamos a participar en la próxima **Feria de Empleo y Vinculación Laboral CECATI 122**, un evento diseñado para conectar directamente a nuestros egresados y estudiantes activos con importantes empresas locales y regionales.

### Detalles del Evento:
- **Fecha:** Viernes 14 de Agosto, 2026
- **Hora:** 9:00 AM - 2:00 PM
- **Lugar:** Explanada Principal del Plantel CECATI 122
- **Dirigido a:** Estudiantes, egresados y comunidad en general.

Habrá vacantes disponibles en áreas operativas, administrativas, de mantenimiento, diseño y servicios. Además, contaremos con módulos de orientación para la elaboración de currículum vitae y simulación de entrevistas de trabajo.

¡No pierdas esta oportunidad de integrarte al mercado laboral!`,
    category: "Eventos y Actividades",
    featuredImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
    author: "Depto. de Vinculación",
    status: "published",
    pinned: false,
    publishedAt: "2026-07-10",
    createdAt: "2026-07-10T09:15:00Z",
    tags: ["Empleo", "Vinculación", "Trabajo", "Empresas"]
  },
  {
    id: "caso-exito-confeccion-emprendimiento",
    title: "Caso de Éxito: Egresada de Confección Abre su Propio Taller Textil",
    slug: "caso-exito-confeccion-emprendimiento",
    excerpt: "Conoce la historia de María Elena, quien tras culminar su capacitación en el CECATI 122 fundó su propia marca de ropa artesanal.",
    content: `En el CECATI 122 nos llena de orgullo compartir los logros de nuestros egresados. Hoy destacamos el caso de María Elena Ramírez, quien tras concluir la especialidad de Confección y Preformado de Prendas, ha logrado consolidar su propio taller de diseño y alta costura.

"Al principio entré al curso buscando aprender costura básica, pero en el CECATI no solo me enseñaron la técnica y el patronaje, sino que los profesores me motivaron a emprender y profesionalizar mi trabajo", comenta María Elena.

Actualmente, su taller brinda empleo a tres familias de la comunidad y comercializa sus diseños tanto de manera local como a través de redes sociales. Historias como la de María Elena nos inspiran a seguir transformando vidas a través de la educación para el trabajo.`,
    category: "Logros y Reconocimientos",
    featuredImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop",
    author: "Comunicación Social",
    status: "published",
    pinned: false,
    publishedAt: "2026-07-02",
    createdAt: "2026-07-02T16:00:00Z",
    tags: ["Emprendimiento", "Caso de Éxito", "Textil"]
  }
];

/**
 * Sube la imagen de una noticia a Firebase Storage
 */
export async function uploadPostImage(file) {
  if (!file) return { url: '', path: '' };

  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `posts/${timestamp}_${cleanFileName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    path: storagePath,
  };
}

/**
 * Elimina la imagen de una noticia de Firebase Storage
 */
export async function deletePostImage(storagePathOrUrl) {
  if (!storagePathOrUrl) return;

  try {
    const imageRef = ref(storage, storagePathOrUrl);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn("No se pudo eliminar la imagen del post de Storage:", err.message);
  }
}

/**
 * Obtiene publicaciones públicas (solo estado 'published') opcionalmente filtradas por categoría
 */
export async function getPosts(category = 'Todas', searchTerm = '') {
  try {
    if (!db) return filterPostsLocally(defaultPosts, category, searchTerm, true);

    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);
    
    let posts = [];
    querySnapshot.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (posts.length === 0) {
      posts = defaultPosts;
    }

    return filterPostsLocally(posts, category, searchTerm, true);
  } catch (error) {
    console.warn("Error obteniendo noticias de Firestore, usando respaldo:", error);
    return filterPostsLocally(defaultPosts, category, searchTerm, true);
  }
}

/**
 * Obtiene todas las noticias (publicadas y borradores) para el Panel Administrativo
 */
export async function getAllPostsAdmin() {
  try {
    if (!db) return defaultPosts;

    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);

    let posts = [];
    querySnapshot.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() });
    });

    if (posts.length === 0) {
      posts = defaultPosts;
    }

    // Ordenar: fijadas primero, luego por fecha descendente
    return posts.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
    });
  } catch (error) {
    console.warn("Error cargando noticias en modo admin:", error);
    return defaultPosts;
  }
}

/**
 * Obtiene una noticia por ID o por Slug
 */
export async function getPostByIdOrSlug(idOrSlug) {
  try {
    if (db) {
      // 1. Intentar buscar por ID directo
      const docRef = doc(db, POSTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

      // 2. Si no se encuentra por ID, buscar por el campo slug o en la colección
      const postsRef = collection(db, POSTS_COLLECTION);
      const querySnapshot = await getDocs(postsRef);
      let found = null;
      querySnapshot.forEach((snap) => {
        const data = snap.data();
        if (snap.id === idOrSlug || data.slug === idOrSlug) {
          found = { id: snap.id, ...data };
        }
      });

      if (found) return found;
    }

    // Fallback a los datos locales
    const localPost = defaultPosts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return localPost || null;
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    const localPost = defaultPosts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    return localPost || null;
  }
}

/**
 * Guarda (crea o actualiza) una noticia en Firestore
 */
export async function savePost(postData, imageFile = null) {
  try {
    let finalImageUrl = postData.featuredImage || '';

    if (imageFile) {
      const uploadRes = await uploadPostImage(imageFile);
      finalImageUrl = uploadRes.url;
    }

    const cleanTitle = postData.title.trim();
    const slug = postData.slug || cleanTitle.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const payload = {
      title: cleanTitle,
      slug: slug,
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      category: postData.category || 'Noticias Generales',
      featuredImage: finalImageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80',
      author: postData.author || 'CECATI 122',
      status: postData.status || 'published',
      pinned: Boolean(postData.pinned),
      publishedAt: postData.publishedAt || new Date().toISOString().split('T')[0],
      tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: serverTimestamp(),
    };

    if (postData.id) {
      const docRef = doc(db, POSTS_COLLECTION, postData.id);
      await updateDoc(docRef, payload);
      return { id: postData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const customId = slug || `post_${Date.now()}`;
      const customDocRef = doc(db, POSTS_COLLECTION, customId);
      await setDoc(customDocRef, payload);
      return { id: customDocRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar noticia en Firestore:", error);
    throw error;
  }
}

/**
 * Cambia el estado de una noticia entre 'published' y 'draft'
 */
export async function togglePostStatus(id, currentStatus) {
  const newStatus = currentStatus === 'published' ? 'draft' : 'published';
  const docRef = doc(db, POSTS_COLLECTION, id);
  await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
  return newStatus;
}

/**
 * Elimina una noticia de Firestore
 */
export async function deletePost(id) {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    throw error;
  }
}

// Función auxiliar interna para filtrar y ordenar posts
function filterPostsLocally(posts, category, searchTerm, onlyPublished = true) {
  let filtered = [...posts];

  if (onlyPublished) {
    filtered = filtered.filter(p => p.status === 'published');
  }

  if (category && category !== 'Todas') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.excerpt.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  return filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
  });
}
