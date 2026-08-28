import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses } from '../services/db';
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
        const data = await getCourses();
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

  useEffect(() => {
    if (courses.length > 0) {
      const courseIdParam = searchParams.get('id') || searchParams.get('curso');
      if (courseIdParam) {
        const found = courses.find(c => String(c.id) === String(courseIdParam));
        if (found) {
          setSelectedCourse(found);
          setActiveTab('overview');
          reg.setRegisterSuccess(false);
        }
      }
    }
  }, [courses, searchParams, reg]);

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

  const handleOpenDetails = useCallback((course) => {
    setSelectedCourse(course);
    setActiveTab('overview');
    reg.setRegisterSuccess(false);
  }, [reg]);

  const handleCloseModal = () => {
    setSelectedCourse(null);
    reg.setRegisterSuccess(false);
    if (searchParams.get('id') || searchParams.get('curso')) {
      setSearchParams({}, { replace: true });
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
