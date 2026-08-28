import { useState, useCallback } from 'react';
import {
  getAllPostsAdmin,
  savePost as savePostToDb,
  deletePost as deletePostFromDb,
  togglePostStatus
} from '../../services/db';

export function useAdminNews({ showToast, setConfirmModal, fetchStorageInfo }) {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [savingPost, setSavingPost] = useState(false);

  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Noticias Generales');
  const [postImage, setPostImage] = useState('');
  const [postImageFile, setPostImageFile] = useState(null);
  const [postAuthor, setPostAuthor] = useState('Dirección CECATI 122');
  const [postStatus, setPostStatus] = useState('published');
  const [postPinned, setPostPinned] = useState(false);
  const [postPublishedAt, setPostPublishedAt] = useState('');
  const [postTags, setPostTags] = useState('');

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const data = await getAllPostsAdmin();
      setPosts(data);
    } catch {
      showToast?.("Error cargando noticias", "error");
    } finally {
      setLoadingPosts(false);
    }
  }, [showToast]);

  const openPostModal = (post = null) => {
    setCurrentPost(post);
    setPostImageFile(null);
    if (post) {
      setPostTitle(post.title || '');
      setPostExcerpt(post.excerpt || '');
      setPostContent(post.content || '');
      setPostCategory(post.category || 'Noticias Generales');
      setPostImage(post.featuredImage || '');
      setPostAuthor(post.author || 'Dirección CECATI 122');
      setPostStatus(post.status || 'published');
      setPostPinned(!!post.pinned);
      setPostPublishedAt(post.publishedAt || new Date().toISOString().split('T')[0]);
      setPostTags(post.tags ? post.tags.join(', ') : '');
    } else {
      setPostTitle('');
      setPostExcerpt('');
      setPostContent('');
      setPostCategory('Noticias Generales');
      setPostImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80');
      setPostAuthor('Dirección CECATI 122');
      setPostStatus('published');
      setPostPinned(false);
      setPostPublishedAt(new Date().toISOString().split('T')[0]);
      setPostTags('Inscripciones, Cursos, CECATI 122');
    }
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
    setCurrentPost(null);
    setPostImageFile(null);
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setSavingPost(true);
    const postData = {
      title: postTitle,
      excerpt: postExcerpt,
      content: postContent,
      category: postCategory,
      featuredImage: postImage,
      author: postAuthor,
      status: postStatus,
      pinned: postPinned,
      publishedAt: postPublishedAt,
      tags: postTags ? postTags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    if (currentPost) postData.id = currentPost.id;

    try {
      await savePostToDb(postData, postImageFile);
      showToast?.(currentPost ? "Noticia actualizada" : "Noticia creada con éxito");
      closePostModal();
      fetchPosts();
      fetchStorageInfo?.();
    } catch {
      showToast?.("Error al guardar la noticia", "error");
    } finally {
      setSavingPost(false);
    }
  };

  const handleTogglePostStatus = async (id, currentStatus) => {
    try {
      await togglePostStatus(id, currentStatus);
      showToast?.("Estado de noticia actualizado");
      fetchPosts();
    } catch {
      showToast?.("Error al cambiar estado de la noticia", "error");
    }
  };

  const handleDeletePost = (id, title) => {
    setConfirmModal?.({
      open: true,
      title: '¿Eliminar Noticia?',
      message: `¿Estás seguro de eliminar la noticia "${title}"?`,
      actionText: 'Eliminar Noticia',
      onConfirm: async () => {
        try {
          await deletePostFromDb(id);
          showToast?.("Noticia eliminada con éxito");
          fetchPosts();
          fetchStorageInfo?.();
        } catch {
          showToast?.("Error al eliminar noticia", "error");
        }
      }
    });
  };

  return {
    posts,
    loadingPosts,
    fetchPosts,
    isPostModalOpen,
    currentPost,
    savingPost,
    openPostModal,
    closePostModal,
    handleSavePost,
    handleTogglePostStatus,
    handleDeletePost,
    postTitle, setPostTitle,
    postExcerpt, setPostExcerpt,
    postContent, setPostContent,
    postCategory, setPostCategory,
    postImage, setPostImage,
    setPostImageFile,
    postAuthor, setPostAuthor,
    postStatus, setPostStatus,
    postPinned, setPostPinned,
    postPublishedAt, setPostPublishedAt,
    postTags, setPostTags
  };
}
