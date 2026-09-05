import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { getCategoryLabel, getCategoryIcon } from '../../utils/searchUtils';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function FeaturedCourses({ courses = [] }) {
  return (
    <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden" id="cursos">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Encabezado de Sección Centrado y Elegante */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-cecati dark:text-red-400 block">
            Oferta Educativa Destacada
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
            Conoce Algunos de Nuestros Cursos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Desarrolla habilidades clave en talleres equipados con certificación oficial SEP.
          </p>
        </div>

        {/* Carrusel Swiper con Botones Flotantes Laterales */}
        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <i className="ri-loader-4-line ri-spin text-3xl mb-2 block text-cecati"></i>
            <p className="text-sm">Cargando cursos destacados...</p>
          </div>
        ) : (
          <div className="relative group/carousel touch-pan-y">
            {/* Botón Flotante Lateral Izquierdo (<) */}
            {courses.length > 1 && (
              <button
                type="button"
                id="featured-prev-btn"
                aria-label="Curso anterior"
                className="absolute left-1.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 dark:bg-zinc-900/80 backdrop-blur-md text-white border border-white/20 shadow-2xl hover:bg-cecati dark:hover:bg-cecati hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <i className="ri-arrow-left-s-line text-2xl"></i>
              </button>
            )}

            {/* Componente Swiper */}
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              observer={true}
              observeParents={true}
              watchSlidesProgress={true}
              touchReleaseOnEdges={false}
              resistance={true}
              resistanceRatio={0.6}
              simulateTouch={true}
              grabCursor={true}
              speed={400}
              touchRatio={1.5}
              touchAngle={45}
              threshold={5}
              touchStartPreventDefault={false}
              preventClicks={true}
              preventClicksPropagation={true}
              loop={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: '#featured-prev-btn',
                nextEl: '#featured-next-btn',
              }}
              pagination={{
                clickable: true,
                el: '.featured-courses-pagination',
                bulletClass: 'inline-block w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-zinc-700 transition-all cursor-pointer mx-1',
                bulletActiveClass: '!w-7 !bg-cecati dark:!bg-red-500 shadow-sm',
              }}
              breakpoints={{
                320: { slidesPerView: 1.15, spaceBetween: 14 },
                480: { slidesPerView: 1.25, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
              }}
              className="w-full pb-3 touch-pan-y [&_.swiper-wrapper]:items-stretch [&_.swiper-wrapper]:touch-pan-y select-none"
            >
              {courses.map((course) => (
                <SwiperSlide key={course.id} className="!h-auto flex touch-pan-y select-none">
                  <Link
                    to={`/cursos?id=${course.id}`}
                    className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 dark:border-zinc-800 flex flex-col justify-between w-full h-full cursor-pointer touch-pan-y select-none"
                  >
                    {/* Imagen del Curso con altura fija */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 select-none">
                      <img
                        src={course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'}
                        alt={course.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                      {/* Insignia de Especialidad */}
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-extrabold bg-cecati text-white shadow-md flex items-center gap-1.5 capitalize pointer-events-none">
                        <i className={getCategoryIcon(course.category)}></i>
                        <span>{getCategoryLabel(course.category)}</span>
                      </span>

                      {/* Precio */}
                      {course.price && (
                        <span className="absolute bottom-3 right-3 text-xs font-extrabold text-emerald-400 bg-black/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 pointer-events-none">
                          {course.price}
                        </span>
                      )}
                    </div>

                    {/* Contenido del Curso */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between select-none">
                      <div>
                        {/* Título con altura fija para 2 líneas */}
                        <div className="h-14 flex items-start overflow-hidden">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-cecati dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug select-none">
                            {course.title}
                          </h3>
                        </div>

                        {/* Horario con altura fija */}
                        <div className="h-10 flex items-center mt-2 overflow-hidden">
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1.5 line-clamp-2 select-none">
                            <i className="ri-time-line text-cecati dark:text-red-400 text-sm shrink-0 mt-0.5"></i>
                            <span className="leading-snug">{course.schedule || 'Horarios Flexibles'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Botón inferior */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-cecati dark:text-red-400 flex items-center justify-between group-hover:translate-x-0.5 transition-transform select-none">
                        <span>Ver Detalles y Temario</span>
                        <i className="ri-arrow-right-line text-sm"></i>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Botón Flotante Lateral Derecho (>) */}
            {courses.length > 1 && (
              <button
                type="button"
                id="featured-next-btn"
                aria-label="Siguiente curso"
                className="absolute right-1.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 dark:bg-zinc-900/80 backdrop-blur-md text-white border border-white/20 shadow-2xl hover:bg-cecati dark:hover:bg-cecati hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-20 disabled:pointer-events-none"
              >
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </button>
            )}

            {/* Puntos indicadores del carrusel */}
            <div className="featured-courses-pagination flex justify-center items-center mt-6"></div>
          </div>
        )}

        {/* Botón general */}
        <div className="text-center mt-10">
          <Link
            to="/cursos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-lg shadow-red-900/20 hover:shadow-red-900/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>Ver Catálogo Completo de Cursos</span>
            <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
