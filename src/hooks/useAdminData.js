import { useState, useCallback, useEffect } from 'react';
import { useAdminAuth } from './admin/useAdminAuth';
import { useQuotaStats } from './admin/useQuotaStats';
import { useAdminRegistrations } from './admin/useAdminRegistrations';
import { useAdminNews } from './admin/useAdminNews';
import { useAdminTestimonials } from './admin/useAdminTestimonials';

export function useAdminData() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [adminTab, setAdminTab] = useState('courses');

  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4000);
  }, []);

  const [confirmModal, setConfirmModal] = useState({
    open: false, title: '', message: '', actionText: 'Eliminar', onConfirm: null
  });

  const auth = useAdminAuth({ showToast });
  const { storageInfo, fetchStorageInfo } = useQuotaStats();
  const reg = useAdminRegistrations({ showToast });
  const news = useAdminNews({ showToast, setConfirmModal, fetchStorageInfo });
  const test = useAdminTestimonials({ showToast, setConfirmModal, fetchStorageInfo });

  const { fetchRegistrations } = reg;
  const { fetchPosts } = news;
  const { fetchTestimonials } = test;

  useEffect(() => {
    document.title = "Administración - CECATI 122";
    if (auth.isLoggedIn) {
      fetchRegistrations();
      fetchPosts();
      fetchTestimonials();
      fetchStorageInfo();
    }
  }, [auth.isLoggedIn, fetchRegistrations, fetchPosts, fetchTestimonials, fetchStorageInfo]);

  return {
    toastMessage, toastType, showToast,
    storageInfo, fetchStorageInfo,
    adminTab, setAdminTab,
    confirmModal, setConfirmModal,
    ...auth,
    ...reg,
    ...news,
    ...test
  };
}
