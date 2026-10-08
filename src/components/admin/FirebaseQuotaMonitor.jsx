import { useEffect, useState } from 'react';

export function FirebaseQuotaMonitor({ isOpen, onClose, storageInfo, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !storageInfo) return null;

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-xl shadow-inner">
              <i className="ri-database-2-line"></i>
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Monitor de Almacenamiento y Cuotas
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                <span>Plan Firebase:</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                  {storageInfo.plan?.name || 'Spark Plan'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshClick}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Actualizar cuotas"
            >
              <i className={`ri-refresh-line text-sm ${isRefreshing ? 'animate-spin text-cecati' : ''}`}></i>
              <span className="hidden sm:inline">Actualizar</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-gray-500 dark:text-gray-400 transition-colors flex items-center justify-center text-lg cursor-pointer"
              title="Cerrar modal"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>

        {/* Medidores de Capacidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meter 1: Firestore Database */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <i className="ri-hard-drive-2-line text-blue-500"></i>
                Firestore (Base de Datos)
              </span>
              <span className="font-mono text-gray-600 dark:text-gray-300 font-semibold text-[11px]">
                {storageInfo.firestore.formatted} / {storageInfo.firestore.limitFormatted}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(1, Math.min(100, parseFloat(storageInfo.firestore.usedPercentage) || 1))}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <span>{storageInfo.firestore.usedPercentage}% utilizado</span>
              <span>Libre: {storageInfo.firestore.remainingFormatted}</span>
            </div>

            <div className="pt-2 border-t border-gray-200/60 dark:border-gray-600/50">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Documentos registrados ({storageInfo.firestore.counts.totalDocs} total):
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <i className="ri-book-open-line text-cecati"></i> {storageInfo.firestore.counts.courses} Cursos
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-newspaper-line text-blue-500"></i> {storageInfo.firestore.counts.posts} Noticias
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-user-add-line text-amber-500"></i> {storageInfo.firestore.counts.registrations} Solicitudes
                </span>
                <span className="flex items-center gap-1">
                  <i className="ri-chat-quote-line text-emerald-500"></i> {storageInfo.firestore.counts.testimonials} Testimonios
                </span>
              </div>
            </div>
          </div>

          {/* Meter 2: Firebase Storage (Images) */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <i className="ri-image-line text-emerald-500"></i>
                Firebase Storage (Imágenes)
              </span>
              <span className="font-mono text-gray-600 dark:text-gray-300 font-semibold text-[11px]">
                {storageInfo.storage.formatted} / {storageInfo.storage.limitFormatted}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(1, Math.min(100, parseFloat(storageInfo.storage.usedPercentage) || 1))}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400 font-medium">
              <span>{storageInfo.storage.usedPercentage}% utilizado</span>
              <span>Libre: {storageInfo.storage.remainingFormatted}</span>
            </div>

            <div className="pt-2 border-t border-gray-200/60 dark:border-gray-600/50">
              <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Archivos en la Nube:
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <i className="ri-folder-image-line text-emerald-500"></i>
                <span>{storageInfo.storage.imageCount} imágenes almacenadas y optimizadas.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Spark Plan Daily Operations Summary */}
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15 space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-shield-check-line text-blue-500 text-base shrink-0"></i>
              <strong className="text-gray-900 dark:text-white">Límites diarios del Plan Gratuito (Spark):</strong>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              Estado: Óptimo
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-gray-500 dark:text-gray-400">
            <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-xl border border-blue-500/10">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">Lecturas diarias</span>
              <span>{storageInfo.plan.dailyReads}</span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-xl border border-blue-500/10">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">Escrituras diarias</span>
              <span>{storageInfo.plan.dailyWrites}</span>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 p-2 rounded-xl border border-blue-500/10">
              <span className="font-bold text-gray-700 dark:text-gray-300 block">Descargas de Storage</span>
              <span>{storageInfo.plan.dailyDownloads}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

