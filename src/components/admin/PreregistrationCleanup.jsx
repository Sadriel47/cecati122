import React, { useState } from 'react';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * Componente para depuración de pre-registros y exportación a CSV optimizada.
 * Respeta las cuotas del plan Spark de Firebase al usar batches de máximo 400 operaciones.
 */
export function PreregistrationCleanup({
  registrations,
  filteredRegistrations,
  setRegistrations,
  showToast
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  // Helper para obtener fecha de pre-registro
  const getRegDate = (reg) => {
    if (!reg.createdAt) return new Date();
    if (reg.createdAt.seconds) {
      return new Date(reg.createdAt.seconds * 1000);
    }
    if (reg.createdAt.toDate) {
      return reg.createdAt.toDate();
    }
    return new Date(reg.createdAt);
  };

  // Identifica si un registro es candidato a purga (CONTACTADO, DESCARTADO o más de 6 meses de antigüedad)
  const isPurgeable = (reg) => {
    const status = (reg.status || 'PENDIENTE').toUpperCase();
    if (status === 'CONTACTADO' || status === 'DESCARTADO') {
      return true;
    }
    
    // Comparar fecha de creación con hace 6 meses
    const regDate = getRegDate(reg);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return regDate < sixMonthsAgo;
  };

  // Lista de registros candidatos a purga
  const purgeableList = registrations.filter(isPurgeable);
  const purgeableCount = purgeableList.length;

  // Acción 1: Exportar a CSV optimizado sin costo de cuota extra
  const handleExportCSV = () => {
    const listToExport = filteredRegistrations || registrations;
    if (!listToExport || listToExport.length === 0) {
      showToast?.("No hay registros en la vista actual para exportar", "error");
      return;
    }

    const headers = ["Nombre Completo", "Teléfono", "Correo Electrónico", "Curso de Interés", "Fecha de Registro", "Estado"];
    const rows = listToExport.map(reg => {
      const regDate = getRegDate(reg).toLocaleString('es-MX');
      return [
        `"${(reg.fullName || '').replace(/"/g, '""')}"`,
        `"${(reg.phone || '').replace(/"/g, '""')}"`,
        `"${(reg.email || '').replace(/"/g, '""')}"`,
        `"${(reg.courseTitle || '').replace(/"/g, '""')}"`,
        `"${regDate}"`,
        `"${reg.status || 'PENDIENTE'}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pre-Registros_CECATI122_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast?.("CSV exportado correctamente");
  };

  // Acción 2: Ejecutar purga de registros antiguos/atendidos en batches
  const handlePurge = async () => {
    if (purgeableCount === 0) {
      showToast?.("No hay registros que requieran ser purgados", "error");
      return;
    }

    setIsPurging(true);
    try {
      const dbPurgeable = purgeableList.filter(r => !r.id.startsWith('local_'));
      const localPurgeable = purgeableList.filter(r => r.id.startsWith('local_'));

      // Purgar en Firestore en bloques de máximo 400 operaciones
      const batchSize = 400;
      for (let i = 0; i < dbPurgeable.length; i += batchSize) {
        const chunk = dbPurgeable.slice(i, i + batchSize);
        const batch = writeBatch(db);
        
        chunk.forEach(reg => {
          const docRef = doc(db, 'preRegistrations', reg.id);
          batch.delete(docRef);
        });

        await batch.commit();
      }

      // Eliminar registros offline de localStorage
      if (localPurgeable.length > 0) {
        const local = JSON.parse(localStorage.getItem('cecati_preregistrations') || '[]');
        const localIds = localPurgeable.map(r => r.id);
        const updatedLocal = local.filter(r => !localIds.includes(r.id));
        localStorage.setItem('cecati_preregistrations', JSON.stringify(updatedLocal));
      }

      // Actualizar estado local inmediatamente sin recargar la colección
      const purgedIds = purgeableList.map(r => r.id);
      setRegistrations(prev => prev.filter(r => !purgedIds.includes(r.id)));

      showToast?.(`Se purgaron ${purgeableCount} registros correctamente`);
      setIsConfirming(false);
    } catch (error) {
      console.error("Error al purgar registros:", error);
      showToast?.("Error al purgar algunos registros de Firestore", "error");
    } finally {
      setIsPurging(false);
    }
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center md:text-left">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-1.5">
          <i className="ri-settings-5-line text-cecati"></i>
          <span>Mantenimiento y Optimización de Cuotas</span>
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xl">
          Protege tus límites de lectura/escritura de Firestore. Exporta datos localmente o purga de forma segura registros atendidos o con más de 6 meses de antigüedad.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Botón de Exportar */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <i className="ri-file-download-line text-sm"></i>
          <span>Exportar a CSV ({filteredRegistrations?.length ?? registrations.length})</span>
        </button>

        {/* Botón de Purga */}
        <button
          onClick={() => {
            if (purgeableCount === 0) {
              showToast?.("No hay registros atendidos o antiguos para purgar", "info");
              return;
            }
            setIsConfirming(true);
          }}
          className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            purgeableCount > 0 
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/10 hover:shadow-rose-900/25' 
              : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
          }`}
        >
          <i className="ri-delete-bin-3-line text-sm"></i>
          <span>Purgar Atendidos / Antiguos ({purgeableCount})</span>
        </button>
      </div>

      {/* Modal de Confirmación para Purga */}
      {isConfirming && (
        <div className="fixed inset-0 z-[10050] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
              <i className="ri-error-warning-line"></i>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">
                ¿Confirmar Purga de Registros?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Se eliminarán permanentemente <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{purgeableCount}</strong> registros con estado <strong className="font-semibold text-gray-700 dark:text-gray-200">CONTACTADO</strong> o <strong className="font-semibold text-gray-700 dark:text-gray-200">DESCARTADO</strong>, o con antigüedad superior a 6 meses.
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-[11px] text-amber-700 dark:text-amber-400 font-medium leading-normal">
                Esta acción ejecutará la eliminación masiva respetando la cuota Spark mediante escrituras por lote (max 400 por batch).
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isPurging}
                onClick={() => setIsConfirming(false)}
                className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isPurging}
                onClick={handlePurge}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-wait text-white font-extrabold text-xs shadow-lg shadow-rose-900/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isPurging ? (
                  <>
                    <i className="ri-loader-4-line ri-spin text-sm"></i>
                    <span>Purgando...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-delete-bin-line text-sm"></i>
                    <span>Sí, eliminar {purgeableCount} registros</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
