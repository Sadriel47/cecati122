import { Link } from 'react-router-dom';

export function FeaturedCourses({ courses }) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300" id="cursos">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cecati dark:text-red-400 mb-2 block">
            Oferta Educativa Destacada
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Conoce Algunos de Nuestros Cursos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Desarrolla habilidades clave en talleres equipados con certificación oficial SEP.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              to={`/cursos?id=${course.id}`}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700/60 flex flex-col cursor-pointer"
              key={course.id}
            >
              {/* Course Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="225"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Category Pill Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-cecati text-white shadow-md">
                  {course.category || 'Capacitación Técnica'}
                </span>
              </div>

              {/* Course Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-cecati dark:group-hover:text-red-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                    <i className="ri-time-line text-cecati text-sm"></i>
                    <span>{course.schedule || 'Horarios Flexibles'}</span>
                  </p>
                </div>

                <div className="inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 dark:border-gray-700 text-xs font-bold text-cecati dark:text-red-400 group-hover:translate-x-1 transition-all">
                  <span>Ver Detalles y Temario</span>
                  <i className="ri-arrow-right-line text-sm"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-bold text-sm shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>Ver Todos los Cursos</span>
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
