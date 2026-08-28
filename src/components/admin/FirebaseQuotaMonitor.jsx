export function FirebaseQuotaMonitor({ storageInfo, onRefresh }) {
  if (!storageInfo) return null;

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
            <i className="ri-database-2-line"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Monitor de Almacenamiento y Cuotas de Firebase
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Plan: <strong className="text-gray-800 dark:text-gray-200">{storageInfo.plan.name}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="text-xs font-bold text-cecati hover:underline flex items-center gap-1 cursor-pointer"
        >
          <i className="ri-refresh-line"></i> Actualizar Cuotas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meter 1: Firestore Database */}
        <div className="space-y-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <i className="ri-hard-drive-2-line text-blue-500"></i>
              Firestore (Base de Datos)
            </span>
            <span className="font-mono text-gray-600 dark:text-gray-300">
              {storageInfo.firestore.formatted} / {storageInfo.firestore.limitFormatted}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(1, parseFloat(storageInfo.firestore.usedPercentage))}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
            <span>{storageInfo.firestore.usedPercentage}% utilizado</span>
            <span>Libre: {storageInfo.firestore.remainingFormatted}</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
            Documentos guardados: {storageInfo.firestore.counts.totalDocs} ({storageInfo.firestore.counts.courses} cursos, {storageInfo.firestore.counts.posts} noticias, {storageInfo.firestore.counts.registrations} solicitudes, {storageInfo.firestore.counts.testimonials} testimonios).
          </p>
        </div>

        {/* Meter 2: Firebase Storage (Images) */}
        <div className="space-y-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
              <i className="ri-image-line text-emerald-500"></i>
              Firebase Storage (Imágenes Subidas)
            </span>
            <span className="font-mono text-gray-600 dark:text-gray-300">
              {storageInfo.storage.formatted} / {storageInfo.storage.limitFormatted}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(1, parseFloat(storageInfo.storage.usedPercentage))}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-gray-500 dark:text-gray-400">
            <span>{storageInfo.storage.usedPercentage}% utilizado</span>
            <span>Libre: {storageInfo.storage.remainingFormatted}</span>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1">
            Imágenes almacenadas en la nube: {storageInfo.storage.imageCount} archivos.
          </p>
        </div>
      </div>

      {/* Spark Plan Daily Operations Summary */}
      <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <i className="ri-information-line text-blue-500 text-base shrink-0"></i>
          <span>
            <strong>Cuotas Diarias del Plan Spark:</strong> {storageInfo.plan.dailyReads} | {storageInfo.plan.dailyWrites} | {storageInfo.plan.dailyDownloads}
          </span>
        </div>
        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
          Estado del Servidor: Óptimo
        </span>
      </div>
    </div>
  );
}
