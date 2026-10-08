export function AdminHeaderStats({ totalCourses, morningShiftsCount, avgCost, onOpenQuotaModal, storageInfo }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
        {/* KPI 1: Cursos Activos */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-cecati/10 text-cecati dark:text-red-400 flex items-center justify-center text-lg shrink-0 font-bold">
            <i className="ri-book-open-line"></i>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block truncate">
              Cursos Activos
            </span>
            <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-tight">
              {totalCourses}
            </span>
          </div>
        </div>

        {/* KPI 2: Cursos Matutinos */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0 font-bold">
            <i className="ri-sun-line"></i>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block truncate">
              Turno Matutino
            </span>
            <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-tight">
              {morningShiftsCount}
            </span>
          </div>
        </div>

        {/* KPI 3: Inversión Promedio */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg shrink-0 font-bold">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block truncate">
              Costo Promedio
            </span>
            <span className="text-lg sm:text-xl font-black text-gray-900 dark:text-white leading-tight truncate block">
              ${avgCost} <span className="text-xs font-normal text-gray-500">MXN</span>
            </span>
          </div>
        </div>

        {/* Quick Widget / Quota Trigger (Visible on lg or standalone) */}
        {onOpenQuotaModal && (
          <div className="col-span-2 sm:col-span-1 md:col-span-3 lg:col-span-1 flex items-center justify-between lg:justify-end gap-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700/60">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-400 block leading-tight">Firebase Cloud</span>
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                  {storageInfo?.plan?.name || 'Spark Plan'}
                </span>
              </div>
            </div>
            <button
              onClick={onOpenQuotaModal}
              title="Ver métricas de almacenamiento y cuotas"
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-cecati dark:text-red-400 text-xs font-bold hover:bg-cecati hover:text-white dark:hover:bg-cecati dark:hover:text-white transition-all shadow-sm border border-gray-200 dark:border-gray-600 flex items-center gap-1 cursor-pointer"
            >
              <i className="ri-dashboard-line"></i>
              <span>Cuotas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

