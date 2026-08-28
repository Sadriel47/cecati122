import { CourseCard } from './CourseCard';

export function CourseGrid({
  filteredCourses,
  loading,
  onOpenDetails,
  onResetFilters
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              Cursos Disponibles
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Selecciona un programa para ver el temario, requisitos e inscribirte.
            </p>
          </div>
          <span className="text-xs font-bold text-cecati dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full self-start sm:self-auto">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso disponible' : 'cursos disponibles'}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-16 space-y-3">
            <i className="ri-loader-4-line ri-spin text-4xl text-cecati block"></i>
            <p className="text-sm font-bold text-gray-500">Cargando oferta educativa...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 space-y-3 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <i className="ri-search-eye-line text-4xl block"></i>
            <p className="text-sm font-medium">No se encontraron cursos que coincidan con la búsqueda o categoría.</p>
            <button
              onClick={onResetFilters}
              className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors cursor-pointer"
            >
              Limpiar búsqueda y ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
