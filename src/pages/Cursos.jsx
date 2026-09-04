import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses, getCourseById } from '../services/db';
import { useCourseRegistration } from '../hooks/useCourseRegistration';
import { CourseFilters } from '../components/courses/CourseFilters';
import { CourseGrid } from '../components/courses/CourseGrid';
import { PreRegisterModal } from '../components/courses/PreRegisterModal';

export default function Cursos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [category, setCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const reg = useCourseRegistration();

  useEffect(() => {
    document.title = "Cursos - CECATI 122";
    window.scrollTo(0, 0);
    const fetchCourses = async () => {
      try {
        const data = await getCourses('todos', true); // Solo activos y limitados a 24
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Error cargando cursos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const courseIdParam = searchParams.get('id') || searchParams.get('curso');

  useEffect(() => {
    if (courses.length > 0) {
      if (courseIdParam) {
        const found = courses.find(c => String(c.id) === String(courseIdParam));
        if (found) {
          setSelectedCourse(prev => {
            if (!prev || String(prev.id) !== String(found.id)) {
              setActiveTab('overview');
              reg.setRegisterSuccess(false);
              return found;
            }
            return prev;
          });
        }
      } else {
        setSelectedCourse(null);
      }
    }
  }, [courses, courseIdParam]);

  useEffect(() => {
    let result = courses;
    if (category !== 'todos') {
      result = result.filter(c => c.category === category);
    }
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(term) ||
        (c.profile && c.profile.toLowerCase().includes(term)) ||
        (c.schedule && c.schedule.toLowerCase().includes(term))
      );
    }
    setFilteredCourses(result);
  }, [category, searchTerm, courses]);

  const handleOpenDetails = useCallback(async (course) => {
    // Si la URL no tiene el ID, la actualizamos. Esto disparará el useEffect de arriba.
    // Si ya estamos en la misma URL, forzamos la apertura directa.
    const currentId = searchParams.get('id') || searchParams.get('curso');
    if (String(currentId) !== String(course.id)) {
      setSearchParams({ id: course.id });
    } else {
      setSelectedCourse({ ...course, isLoadingDetails: true });
      setActiveTab('overview');
      reg.setRegisterSuccess(false);
    }

    try {
      const fullDetails = await getCourseById(course.id);
      setSelectedCourse(fullDetails ? { ...fullDetails, isLoadingDetails: false } : course);
    } catch (err) {
      console.error("Error al obtener detalle del curso:", err);
      setSelectedCourse({ ...course, isLoadingDetails: false });
    }
  }, [reg, searchParams, setSearchParams]);

  const handleCloseModal = () => {
    reg.setRegisterSuccess(false);
    if (searchParams.get('id') || searchParams.get('curso')) {
      // Al limpiar los params, el useEffect cerrará el modal automáticamente
      setSearchParams({}, { replace: true });
    } else {
      setSelectedCourse(null);
    }
  };

  return (
    <main className="main overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      <CourseFilters
        category={category}
        setCategory={setCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <CourseGrid
        filteredCourses={filteredCourses}
        loading={loading}
        onOpenDetails={handleOpenDetails}
        onResetFilters={() => { setCategory('todos'); setSearchTerm(''); }}
      />

      <PreRegisterModal
        selectedCourse={selectedCourse}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={handleCloseModal}
        formData={reg.formData}
        setFormData={reg.setFormData}
        honeypot={reg.honeypot}
        setHoneypot={reg.setHoneypot}
        regError={reg.regError}
        registerSuccess={reg.registerSuccess}
        setRegisterSuccess={reg.setRegisterSuccess}
        submittingReg={reg.submittingReg}
        lastRegistered={reg.lastRegistered}
        handleRegisterSubmit={(e) => reg.handleRegisterSubmit(e, selectedCourse)}
      />
    </main>
  );
}
