import { useState, useCallback } from 'react';
import { getPreRegistrations, updateRegistrationStatus } from '../../services/registrationService';

export function useAdminRegistrations({ showToast }) {
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const data = await getPreRegistrations();
      setRegistrations(data);
    } catch {
      showToast?.("Error cargando solicitudes de pre-registro", "error");
    } finally {
      setLoadingRegs(false);
    }
  }, [showToast]);

  const handleRegistrationStatusChange = async (id, newStatus) => {
    try {
      await updateRegistrationStatus(id, newStatus);
      showToast?.(`Estado actualizado a: ${newStatus}`);
      fetchRegistrations();
    } catch {
      showToast?.("Error actualizando estado", "error");
    }
  };

  const exportRegistrationsToCSV = () => {
    if (!registrations || registrations.length === 0) {
      showToast?.("No hay solicitudes registradas para exportar", "error");
      return;
    }
    const headers = ["Nombre Completo", "Curso Solicitado", "Telefono", "Email", "Estado", "Fecha de Registro"];
    const rows = registrations.map(reg => [
      `"${(reg.fullName || '').replace(/"/g, '""')}"`,
      `"${(reg.courseTitle || '').replace(/"/g, '""')}"`,
      `"${reg.phone || ''}"`,
      `"${reg.email || ''}"`,
      `"${reg.status || 'PENDIENTE'}"`,
      `"${reg.createdAt ? (typeof reg.createdAt === 'string' ? reg.createdAt : new Date(reg.createdAt.seconds * 1000).toLocaleString('es-MX')) : ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Pre-Registros_CECATI122_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    registrations,
    loadingRegs,
    fetchRegistrations,
    handleRegistrationStatusChange,
    exportRegistrationsToCSV
  };
}
