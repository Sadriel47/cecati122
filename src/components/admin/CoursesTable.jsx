import { CourseRow } from './CourseRow';

export function CoursesTable({
  courses,
  loading,
  searchTerm,
  setSearchTerm,
  onEditCourse,
  onDeleteCourse,
  onCreateCourse,
  onQuickUpdate
}) {
  return (
    <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg space-y-5 animate-fade-in">
      {/* Table Header Filter Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-700/60">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>Catálogo de Cursos</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cecati/10 text-cecati dark:text-red-400 font-bold">
              {courses.length} {courses.length === 1 ? 'curso' : 'cursos'}
            </span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Administra cursos, docentes, tarifas y períodos de inscripción en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Buscar por nombre, docente o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cecati transition-all"
            />
            <i className="ri-search-line absolute left-3.5 top-2.5 text-gray-400 text-sm"></i>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs"
                title="Limpiar búsqueda"
              >
                <i className="ri-close-circle-fill"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Table Content */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <i className="ri-loader-4-line ri-spin text-3xl text-cecati block"></i>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cargando catálogo escolar...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 space-y-3 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-750/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto text-xl text-gray-400">
            <i className="ri-folder-open-line"></i>
          </div>
          <p className="text-sm font-medium">
            {searchTerm ? `No se encontraron resultados para "${searchTerm}"` : 'No hay cursos registrados en el catálogo.'}
          </p>
          <button
            onClick={onCreateCourse}
            className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-900/20"
          >
            <i className="ri-add-line"></i> Crear Nuevo Curso
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-8">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-[11px] font-extrabold uppercase tracking-wider">
                <th className="py-2.5 px-3">Portada</th>
                <th className="py-2.5 px-3">Curso y Docente</th>
                <th className="py-2.5 px-3">Especialidad</th>
                <th className="py-2.5 px-3">Turno</th>
                <th className="py-2.5 px-3">Inversión</th>
                <th className="py-2.5 px-3">Período / Estatus</th>
                <th className="py-2.5 px-3 text-right">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {courses.map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                  onQuickUpdate={onQuickUpdate}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

