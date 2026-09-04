import { memo, useState, useEffect } from 'react';
import { formatDateRange, getShiftBadge } from '../../utils/dateUtils';

export const CourseRow = memo(function CourseRow({ course, onEdit, onDelete, onQuickUpdate }) {
  const [shift, setShift] = useState(course.shift || 'Matutino');
  const [price, setPrice] = useState(course.price || '');
  const [startDate, setStartDate] = useState(course.startDate || '');
  const [endDate, setEndDate] = useState(course.endDate || '');

  const shiftBadge = getShiftBadge(shift);

  useEffect(() => {
    setShift(course.shift || 'Matutino');
    setPrice(course.price || '');
    setStartDate(course.startDate || '');
    setEndDate(course.endDate || '');
  }, [course]);

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
    }
  };

  let thumbImg = course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80';
  if (thumbImg.includes('unsplash.com') && !thumbImg.includes('w=')) {
    thumbImg += '&w=120&q=70&auto=format';
  }

  return (
    <tr className="cv-auto-row hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
      <td className="py-3 px-2">
        <img
          src={thumbImg}
          alt={course.title}
          loading="lazy"
          decoding="async"
          width="56"
          height="40"
          className="w-14 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700"
        />
      </td>
      <td className="py-3 px-2">
        <div className="font-bold text-gray-900 dark:text-white leading-tight">{course.title}</div>
        <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
          <i className="ri-user-star-line text-cecati"></i>
          <span>{course.instructor ? `Prof. ${course.instructor}` : 'Sin profesor asignado'}</span>
        </div>
      </td>
      <td className="py-3 px-2 capitalize">{course.category}</td>
      <td className="py-3 px-2">
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
      <td className="py-3 px-2 font-extrabold text-emerald-600 dark:text-emerald-400">
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={(e) => handleBlur('price', e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-24 bg-transparent border-b border-transparent hover:border-gray-400 focus:border-cecati focus:outline-none"
        />
      </td>
      <td className="py-3 px-2 font-medium flex flex-col gap-1 justify-center min-h-[4.5rem]">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={(e) => handleBlur('startDate', e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[110px] bg-transparent border-b border-transparent hover:border-gray-400 focus:border-cecati focus:outline-none text-[11px] sm:text-xs [color-scheme:light] dark:[color-scheme:dark]"
          title="Fecha de Inicio"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={(e) => handleBlur('endDate', e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-[110px] bg-transparent border-b border-transparent hover:border-gray-400 focus:border-cecati focus:outline-none text-[11px] sm:text-xs text-gray-500 [color-scheme:light] dark:[color-scheme:dark]"
          title="Fecha de Término"
        />
      </td>
      <td className="py-3 px-2 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(course)}
            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <i className="ri-edit-line"></i> Editar
          </button>
          <button
            onClick={() => onDelete(course.id, course.title)}
            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <i className="ri-delete-bin-line"></i> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
});
