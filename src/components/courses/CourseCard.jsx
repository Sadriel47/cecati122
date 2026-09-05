import { memo } from 'react';
import { formatCourseDate, getCourseStatusBadge, getShiftBadge } from '../../utils/dateUtils';
import { getCategoryLabel, getCategoryIcon } from '../../utils/searchUtils';

export const CourseCard = memo(function CourseCard({ course, onOpenDetails }) {
  const statusBadge = getCourseStatusBadge(course.startDate, course.endDate);
  const shiftBadge = getShiftBadge(course.shift);

  let rawImg = course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80';
  if (rawImg.includes('unsplash.com') && !rawImg.includes('w=')) {
    rawImg += '&w=400&q=75&auto=format';
  }

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(course);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles del curso ${course.title}`}
      className="cv-auto-card group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cecati"
    >
      <div>
        {/* Imagen de Portada con Badge de Estado y Especialidad */}
        <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={rawImg}
            alt={course.title}
            loading="lazy"
            decoding="async"
            width="400"
            height="225"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-cecati text-white shadow-md flex items-center gap-1.5">
            <i className={getCategoryIcon(course.category)}></i>
            <span className="capitalize">{getCategoryLabel(course.category)}</span>
          </span>

          <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border shadow-sm flex items-center gap-1 ${statusBadge.colorClass}`}>
            <i className={`${statusBadge.icon} text-xs`}></i>
            <span>{statusBadge.label}</span>
          </span>

          <div className="absolute bottom-3 left-4 right-4 text-white flex justify-between items-end">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {course.price || '$1,200 MXN'}
            </span>
          </div>
        </div>

        {/* Información del Curso */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-cecati dark:group-hover:text-red-400 transition-colors leading-snug">
            {course.title}
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 pt-1">
            <div className="flex items-center justify-between gap-2">
              {/* Insignia de Turno */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-2xs ${shiftBadge.colorClass}`}>
                <i className={`${shiftBadge.icon} ${shiftBadge.iconColor} text-sm`}></i>
                <span>{course.shift || 'Matutino'}</span>
              </span>

              <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-200 text-[11px]">
                <i className="ri-calendar-event-line text-cecati dark:text-red-400 text-xs"></i>
                <span className="truncate max-w-[145px]" title={course.formattedPeriod || formatCourseDate(course.startDate, course.endDate)}>
                  {course.formattedPeriod || formatCourseDate(course.startDate, course.endDate)}
                </span>
              </span>
            </div>

            {course.instructor && (
              <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 pt-0.5 border-t border-gray-100 dark:border-gray-700/60">
                <i className="ri-user-star-line text-cecati dark:text-red-400 text-sm shrink-0"></i>
                <span className="truncate" title={`Profesor(a): ${course.instructor}`}>
                  Prof. <strong className="text-gray-700 dark:text-gray-300 font-bold">{course.instructor}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botón de Acción */}
      <div className="p-5 pt-0">
        <div
          className="w-full py-3.5 rounded-xl bg-cecati group-hover:bg-cecati-hover text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 pointer-events-none"
        >
          <span>Ver Detalles e Inscribirme</span>
          <i className="ri-arrow-right-line"></i>
        </div>
      </div>
    </article>
  );
});
