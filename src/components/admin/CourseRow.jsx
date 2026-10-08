import { memo, useState, useEffect, useRef } from 'react';
import { formatDateRange, getShiftBadge, getCourseStatusBadge } from '../../utils/dateUtils';

export const CourseRow = memo(function CourseRow({ course, onEdit, onDelete, onQuickUpdate }) {
  const [shift, setShift] = useState(course.shift || 'Matutino');
  const [price, setPrice] = useState(course.price || '');
  const [startDate, setStartDate] = useState(course.startDate || '');
  const [endDate, setEndDate] = useState(course.endDate || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingDates, setIsEditingDates] = useState(false);

  const menuRef = useRef(null);
  const shiftBadge = getShiftBadge(shift);
  const statusBadge = getCourseStatusBadge(startDate, endDate);

  useEffect(() => {
    setShift(course.shift || 'Matutino');
    setPrice(course.price || '');
    setStartDate(course.startDate || '');
    setEndDate(course.endDate || '');
  }, [course]);

  // Manejar clic fuera para cerrar el menú contextual
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsEditingDates(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleBlur = (field, value) => {
    let hasChanged = false;
    let updatePayload = { ...course };

    if (field === 'shift') {
      if (course.shift !== value) {
        hasChanged = true;
        updatePayload.shift = value;
      }
    } else if (field === 'price') {
      if (course.price !== value) {
        hasChanged = true;
        updatePayload.price = value;
      }
    } else if (field === 'startDate') {
      if (course.startDate !== value) {
        hasChanged = true;
        updatePayload.startDate = value;
        updatePayload.formattedPeriod = formatDateRange(value, course.endDate);
      }
    } else if (field === 'endDate') {
      if (course.endDate !== value) {
        hasChanged = true;
        updatePayload.endDate = value;
        updatePayload.formattedPeriod = formatDateRange(course.startDate, value);
      }
    }

    if (hasChanged && onQuickUpdate) {
      onQuickUpdate(updatePayload);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
      setIsEditingDates(false);
    }
  };

  let thumbImg = course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80';
  if (thumbImg.includes('unsplash.com') && !thumbImg.includes('w=')) {
    thumbImg += '&w=120&q=70&auto=format';
  }

  const formattedPeriod = formatDateRange(startDate, endDate);

  return (
    <tr className="cv-auto-row hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors border-b border-gray-100 dark:border-gray-700/60">
      {/* Portada */}
      <td className="py-3 px-3">
        <img
          src={thumbImg}
          alt={course.title}
          loading="lazy"
          decoding="async"
          width="48"
          height="36"
          className="w-12 h-9 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 shrink-0"
        />
      </td>

      {/* Título y Profesor */}
      <td className="py-3 px-3 min-w-[200px]">
        <div className="font-bold text-gray-900 dark:text-white leading-tight text-xs sm:text-sm">{course.title}</div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
          <i className="ri-user-star-line text-cecati"></i>
          <span>{course.instructor ? `Prof. ${course.instructor}` : 'Sin profesor asignado'}</span>
        </div>
      </td>

      {/* Categoría */}
      <td className="py-3 px-3 capitalize">
        <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold">
          {course.category}
        </span>
      </td>

      {/* Turno */}
      <td className="py-3 px-3">
        <select
          value={shift}
          onChange={(e) => {
            setShift(e.target.value);
            handleBlur('shift', e.target.value);
          }}
          className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold cursor-pointer transition-colors ${shiftBadge.colorClass} focus:outline-none focus:ring-2 focus:ring-cecati`}
        >
          <option value="Matutino" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Matutino</option>
          <option value="Vespertino" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Vespertino</option>
          <option value="Sabatino" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Sabatino</option>
          <option value="Dominical" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Dominical</option>
          <option value="Mixto / Fin de Semana" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Mixto</option>
          <option value="Especial / Flexible" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Especial</option>
        </select>
      </td>

      {/* Inversión */}
      <td className="py-3 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">
        <div className="flex items-center">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={(e) => handleBlur('price', e.target.value)}
            onKeyDown={handleKeyDown}
            title="Haz clic para editar el costo directamente"
            className="w-24 px-1.5 py-0.5 rounded bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-dashed border-gray-300 dark:border-gray-600 focus:border-solid focus:border-cecati focus:outline-none font-bold text-xs sm:text-sm"
          />
        </div>
      </td>

      {/* Período / Fechas Compactadas */}
      <td className="py-3 px-3">
        <div className="space-y-1">
          {/* Vista formateada agrupada */}
          {!isEditingDates ? (
            <div className="flex items-center gap-1.5 group/dates">
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                <i className="ri-calendar-event-line text-cecati text-xs"></i>
                {formattedPeriod}
              </span>
              <button
                onClick={() => setIsEditingDates(true)}
                title="Editar fechas de inicio y término"
                className="opacity-0 group-hover/dates:opacity-100 p-0.5 rounded text-gray-400 hover:text-cecati transition-opacity text-xs cursor-pointer"
              >
                <i className="ri-pencil-line"></i>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-cecati shadow-sm">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={(e) => handleBlur('startDate', e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-28 text-[11px] bg-transparent border-0 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                title="Fecha de Inicio"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={(e) => handleBlur('endDate', e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-28 text-[11px] bg-transparent border-0 focus:outline-none [color-scheme:light] dark:[color-scheme:dark]"
                title="Fecha de Término"
              />
              <button
                onClick={() => setIsEditingDates(false)}
                className="p-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
                title="Listo"
              >
                <i className="ri-check-line"></i>
              </button>
            </div>
          )}

          {/* Badge de Estado del Curso */}
          <div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.colorClass}`}>
              <i className={`${statusBadge.icon} text-[11px]`}></i>
              {statusBadge.label}
            </span>
          </div>
        </div>
      </td>

      {/* Menú Contextual de Tres Puntos (⋮) */}
      <td className="py-3 px-3 text-right relative">
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors flex items-center justify-center text-base cursor-pointer"
            aria-label="Opciones del curso"
            title="Más opciones"
          >
            <i className="ri-more-2-fill"></i>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50 animate-fade-in divide-y divide-gray-100 dark:divide-gray-700">
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(course);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <i className="ri-edit-line text-blue-500 text-sm"></i>
                  <span>Editar Curso</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDelete(course.id, course.title);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <i className="ri-delete-bin-line text-red-500 text-sm"></i>
                  <span>Eliminar Curso</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
});

