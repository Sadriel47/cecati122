import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCourses, saveCourse, deleteCourse } from '../services/db';
import { rateLimitCheck, sanitizeInput, validateCourseSchema } from '../utils/securityUtils';
import { formatDateRange, formatCourseDate, formatSchedulesToString } from '../utils/dateUtils';
import { courseMatchesSearch } from '../utils/searchUtils';

/**
 * Custom hook para la gestión reactiva de cursos y mutaciones con Firebase.
 */
export function useCourses({ showToast, onCourseMutated }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
      if (onCourseMutated) onCourseMutated();
    } catch (err) {
      console.error("Error al cargar la lista de cursos:", err);
      showToast?.("Error cargando la lista de cursos.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, onCourseMutated]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;
    return courses.filter(c => courseMatchesSearch(c, searchTerm));
  }, [courses, searchTerm]);

  const totalCourses = courses.length;

  const morningShiftsCount = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.shift === 'Matutino' ? 1 : 0), 0);
  }, [courses]);

  const avgCost = useMemo(() => {
    if (courses.length === 0) return 0;
    const sum = courses.reduce((acc, c) => {
      const priceNum = parseInt((c.price || '').replace(/[^0-9]/g, ''), 10) || 0;
      return acc + priceNum;
    }, 0);
    return Math.round(sum / courses.length);
  }, [courses]);

  const handleSaveCourse = async ({
    currentCourse,
    formTitle,
    formCategory,
    formShift,
    formInstructor,
    formStartDate,
    formEndDate,
    formSchedules,
    formRequirements,
    formPrice,
    formImage,
    formImageFile,
    formProfile,
    formSyllabus,
    formPayments
  }) => {
    if (!rateLimitCheck('save_course', 1500)) {
      showToast?.("Por favor espera un momento antes de enviar de nuevo", "error");
      return false;
    }

    const sanitizedTitle = sanitizeInput(formTitle);
    const sanitizedInstructor = sanitizeInput(formInstructor || '');
    const sanitizedReq = sanitizeInput(formRequirements);
    const sanitizedPrice = sanitizeInput(formPrice);
    const sanitizedProfile = sanitizeInput(formProfile);

    const defaultImg = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80";

    const formattedPeriod = (formStartDate && formEndDate)
      ? formatDateRange(formStartDate, formEndDate)
      : formatCourseDate(formStartDate);

    const scheduleText = formatSchedulesToString(formSchedules);

    const courseData = {
      title: sanitizedTitle,
      category: formCategory,
      shift: formShift || 'Matutino',
      instructor: sanitizedInstructor,
      startDate: formStartDate,
      endDate: formEndDate,
      formattedPeriod: formattedPeriod,
      schedules: formSchedules,
      schedule: scheduleText,
      requirements: sanitizedReq,
      price: sanitizedPrice,
      image: formImage || defaultImg,
      profile: sanitizedProfile,
      syllabus: formSyllabus.map(s => sanitizeInput(s)).filter(s => s !== ''),
      payments: formPayments.filter(p => p.date.trim() !== '' && p.title.trim() !== '')
    };

    const validation = validateCourseSchema(courseData);
    if (!validation.isValid) {
      showToast?.(validation.errors[0], "error");
      return false;
    }

    setSavingCourse(true);

    if (currentCourse) {
      courseData.id = currentCourse.id;
    }

    try {
      await saveCourse(courseData, formImageFile);
      showToast?.(currentCourse ? "Curso actualizado con éxito" : "Curso creado con éxito");
      await fetchCourses();
      return true;
    } catch (err) {
      console.error("Error guardando el curso:", err);
      showToast?.("Error al guardar el curso", "error");
      return false;
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async (id, imageUrl) => {
    try {
      await deleteCourse(id, imageUrl);
      showToast?.("Curso eliminado con éxito");
      await fetchCourses();
      return true;
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
      showToast?.("Error al eliminar el curso", "error");
      return false;
    }
  };

  const handleQuickUpdateCourse = async (courseToUpdate) => {
    setSavingCourse(true);
    try {
      await saveCourse(courseToUpdate, null);
      showToast?.("Curso actualizado con éxito");
      await fetchCourses();
      return true;
    } catch (err) {
      console.error("Error en quick update:", err);
      showToast?.("Error al actualizar", "error");
      return false;
    } finally {
      setSavingCourse(false);
    }
  };

  return {
    courses,
    loading,
    savingCourse,
    searchTerm,
    setSearchTerm,
    filteredCourses,
    totalCourses,
    morningShiftsCount,
    avgCost,
    fetchCourses,
    handleSaveCourse,
    handleDeleteCourse,
    handleQuickUpdateCourse
  };
}
