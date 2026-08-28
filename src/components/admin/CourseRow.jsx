import { memo } from 'react';
import { formatDateRange } from '../../utils/dateUtils';

export const CourseRow = memo(function CourseRow({ course, onEdit, onDelete }) {
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
      <td className="py-3 px-2 font-bold text-gray-900 dark:text-white">{course.title}</td>
      <td className="py-3 px-2 capitalize">{course.category}</td>
      <td className="py-3 px-2">{course.duration} hrs</td>
      <td className="py-3 px-2 font-extrabold text-emerald-600 dark:text-emerald-400">{course.price}</td>
      <td className="py-3 px-2 font-medium">{course.formattedPeriod || formatDateRange(course.startDate, course.endDate)}</td>
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
