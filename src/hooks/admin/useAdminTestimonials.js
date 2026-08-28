import { useState, useCallback } from 'react';
import {
  getAllTestimonialsAdmin,
  saveTestimonial as saveTestimonialToDb,
  deleteTestimonial as deleteTestimonialFromDb,
  toggleTestimonialStatus
} from '../../services/db';

export function useAdminTestimonials({ showToast, setConfirmModal, fetchStorageInfo }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  const [tStudentName, setTStudentName] = useState('');
  const [tRoleOrCourse, setTRoleOrCourse] = useState('');
  const [tTitle, setTTitle] = useState('');
  const [tComment, setTComment] = useState('');
  const [tRating, setTRating] = useState(5);
  const [tStatus, setTStatus] = useState('published');
  const [tAvatar, setTAvatar] = useState('');
  const [tAvatarFile, setTAvatarFile] = useState(null);

  const fetchTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    try {
      const data = await getAllTestimonialsAdmin();
      setTestimonials(data);
    } catch {
      showToast?.("Error cargando testimonios", "error");
    } finally {
      setLoadingTestimonials(false);
    }
  }, [showToast]);

  const openTestimonialModal = (item = null) => {
    setCurrentTestimonial(item);
    setTAvatarFile(null);
    if (item) {
      setTStudentName(item.studentName || '');
      setTRoleOrCourse(item.roleOrCourse || '');
      setTTitle(item.title || '');
      setTComment(item.comment || '');
      setTRating(item.rating || 5);
      setTStatus(item.status || 'published');
      setTAvatar(item.avatar || '');
    } else {
      setTStudentName('');
      setTRoleOrCourse('Alumno de Informática');
      setTTitle('');
      setTComment('');
      setTRating(5);
      setTStatus('published');
      setTAvatar('/assets/img/testimonial-profile-1.png');
    }
    setIsTestimonialModalOpen(true);
  };

  const closeTestimonialModal = () => {
    setIsTestimonialModalOpen(false);
    setCurrentTestimonial(null);
    setTAvatarFile(null);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setSavingTestimonial(true);
    const testimonialData = {
      studentName: tStudentName,
      roleOrCourse: tRoleOrCourse,
      title: tTitle,
      comment: tComment,
      rating: tRating,
      status: tStatus,
      avatar: tAvatar,
    };
    if (currentTestimonial) testimonialData.id = currentTestimonial.id;

    try {
      await saveTestimonialToDb(testimonialData, tAvatarFile);
      showToast?.(currentTestimonial ? "Testimonio actualizado" : "Testimonio guardado");
      closeTestimonialModal();
      fetchTestimonials();
      fetchStorageInfo?.();
    } catch {
      showToast?.("Error al guardar testimonio", "error");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleToggleTestimonialStatus = async (id, currentStatus) => {
    try {
      await toggleTestimonialStatus(id, currentStatus);
      showToast?.("Estado de testimonio actualizado");
      fetchTestimonials();
    } catch {
      showToast?.("Error al cambiar estado de testimonio", "error");
    }
  };

  const handleDeleteTestimonial = (id, name) => {
    setConfirmModal?.({
      open: true,
      title: '¿Eliminar Testimonio?',
      message: `¿Estás seguro de eliminar el testimonio de "${name}"?`,
      actionText: 'Eliminar Testimonio',
      onConfirm: async () => {
        try {
          await deleteTestimonialFromDb(id);
          showToast?.("Testimonio eliminado");
          fetchTestimonials();
          fetchStorageInfo?.();
        } catch {
          showToast?.("Error al eliminar testimonio", "error");
        }
      }
    });
  };

  return {
    testimonials,
    loadingTestimonials,
    fetchTestimonials,
    isTestimonialModalOpen,
    currentTestimonial,
    savingTestimonial,
    openTestimonialModal,
    closeTestimonialModal,
    handleSaveTestimonial,
    handleToggleTestimonialStatus,
    handleDeleteTestimonial,
    tStudentName, setTStudentName,
    tRoleOrCourse, setTRoleOrCourse,
    tTitle, setTTitle,
    tComment, setTComment,
    tRating, setTRating,
    tStatus, setTStatus,
    tAvatar, setTAvatar,
    setTAvatarFile
  };
}
