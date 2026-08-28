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

export const defaultPosts = [];

export async function seedDefaultPostsToFirestore() {
  return [];
}

/**
 * Sube una imagen de portada para noticia a Firebase Storage
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
 * Elimina una imagen de noticia de Firebase Storage
 */
export async function deletePostImage(storagePathOrUrl) {
  if (!storagePathOrUrl) return;

  try {
    const imageRef = ref(storage, storagePathOrUrl);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn("No se pudo eliminar la imagen de la noticia de Storage:", err.message);
  }
}

/**
 * Obtiene todas las noticias publicadas para la vista pública
 */
export async function getPosts(category = 'todas') {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q;

    if (category && category !== 'todas') {
      q = query(postsRef, where('category', '==', category), where('status', '==', 'published'));
    } else {
      q = query(postsRef, where('status', '==', 'published'));
    }

    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((snap) => {
      posts.push({ id: snap.id, ...snap.data() });
    });

    posts.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
    });

    return posts;
  } catch (error) {
    console.error("Error al obtener noticias desde Firestore:", error);
    return [];
  }
}

/**
 * Obtiene todas las noticias para el panel de administración
 */
export async function getAllPostsAdmin() {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);
    const posts = [];
    querySnapshot.forEach((snap) => {
      posts.push({ id: snap.id, ...snap.data() });
    });

    posts.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt);
    });

    return posts;
  } catch (error) {
    console.warn("Error cargando noticias en modo admin:", error);
    return [];
  }
}

/**
 * Obtiene una noticia por ID o por Slug
 */
export async function getPostByIdOrSlug(idOrSlug) {
  try {
    if (db) {
      const docRef = doc(db, POSTS_COLLECTION, idOrSlug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }

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

    return null;
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    return null;
  }
}

/**
 * Guarda (crea o actualiza) una noticia en Firestore
 */
export async function savePost(postData, imageFile = null) {
  try {
    let imageUrl = postData.featuredImage || '';

    if (imageFile) {
      const uploadResult = await uploadPostImage(imageFile);
      imageUrl = uploadResult.url;
    }

    const payload = {
      title: postData.title,
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      category: postData.category || 'Noticias Generales',
      featuredImage: imageUrl,
      author: postData.author || 'Dirección CECATI 122',
      status: postData.status || 'published',
      pinned: !!postData.pinned,
      publishedAt: postData.publishedAt || new Date().toISOString().split('T')[0],
      tags: postData.tags || [],
      updatedAt: serverTimestamp(),
    };

    if (postData.id) {
      const docRef = doc(db, POSTS_COLLECTION, postData.id);
      await updateDoc(docRef, payload);
      return { id: postData.id, ...payload };
    } else {
      payload.createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, POSTS_COLLECTION), payload);
      return { id: docRef.id, ...payload };
    }
  } catch (error) {
    console.error("Error al guardar noticia en Firestore:", error);
    throw error;
  }
}

/**
 * Elimina una noticia de Firestore
 */
export async function deletePost(id, imageUrl = null) {
  try {
    if (imageUrl) {
      await deletePostImage(imageUrl);
    }
    const docRef = doc(db, POSTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar noticia de Firestore:", error);
    throw error;
  }
}

/**
 * Cambia el estado (published / draft) de una noticia
 */
export async function togglePostStatus(id, currentStatus) {
  try {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
    return newStatus;
  } catch (error) {
    console.error("Error al cambiar estado de noticia:", error);
    throw error;
  }
}
