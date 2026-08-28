export function AdminHeaderStats({ totalCourses, totalHours, avgCost }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">
          <i className="ri-book-open-line"></i>
        </div>
        <div>
          <span className="block text-2xl font-black text-gray-900 dark:text-white">{totalCourses}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cursos Activos</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
          <i className="ri-time-line"></i>
        </div>
        <div>
          <span className="block text-2xl font-black text-gray-900 dark:text-white">{totalHours} hrs</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Horas de Capacitación</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl font-bold">
          <i className="ri-money-dollar-circle-line"></i>
        </div>
        <div>
          <span className="block text-2xl font-black text-gray-900 dark:text-white">${avgCost} MXN</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Costo Promedio</span>
        </div>
      </div>
    </div>
  );
}
