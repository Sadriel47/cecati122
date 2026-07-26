import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCourses } from '../services/db';
import { createPreRegistration } from '../services/registrationService';

export default function Cursos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [category, setCategory] = useState('todos');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Formulario de Pre-registro
  const [formData, setFormData] = useState({ fullName: '', phone: '', email: '', preferredSchedule: '' });
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [submittingReg, setSubmittingReg] = useState(false);
  const [lastRegistered, setLastRegistered] = useState(null);

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
          setRegisterSuccess(false);
        }
      }
    }
  }, [courses, searchParams]);

  useEffect(() => {
    if (category === 'todos') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(c => c.category === category));
    }
  }, [category, courses]);

  const handleOpenDetails = (course) => {
    setSelectedCourse(course);
    setActiveTab('overview');
    setRegisterSuccess(false);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setRegisterSuccess(false);
    if (searchParams.get('id') || searchParams.get('curso')) {
      setSearchParams({}, { replace: true });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReg(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
      };

      await createPreRegistration(payload);
      setLastRegistered(payload);
      setRegisterSuccess(true);
      setFormData({ fullName: '', phone: '', email: '', preferredSchedule: '' });
    } catch (err) {
      console.error("Error guardando pre-registro:", err);
    } finally {
      setSubmittingReg(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'tecnologia': return 'ri-computer-line';
      case 'textil': return 'ri-shirt-line';
      case 'gastronomia': return 'ri-cake-3-line';
      case 'administracion': return 'ri-briefcase-line';
      case 'automotriz': return 'ri-tools-line';
      default: return 'ri-book-open-line';
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'tecnologia': return 'Tecnología';
      case 'textil': return 'Textil';
      case 'gastronomia': return 'Gastronomía';
      case 'administracion': return 'Administración';
      case 'automotriz': return 'Automotriz';
      default: return 'General';
    }
  };

  return (
    <main className="main overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/*==================== HERO SECTION ====================*/}
      <section className="relative min-h-[50vh] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden bg-gradient-to-br from-[#5C0A22] via-[#12161F] to-[#8B1336]" id="home">
        {/* Background Image */}
        <img 
          src="/assets/img/home-img-1.jpg" 
          alt="Cursos CECATI 122" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-gray-900 backdrop-blur-sm"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-award-fill text-red-400 text-base"></i>
            <span>Catálogo Oficial DGCFT • SEP</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Oferta Educativa y <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">Cursos Prácticos</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Capacitación técnica de alto impacto para el trabajo y el emprendimiento. Diplomas con validez oficial otorgada por la SEP.
          </p>
        </div>
      </section>

      {/*==================== CATEGORY FILTERS ====================*/}
      <section className="max-w-6xl mx-auto px-4 -mt-6 relative z-20">
        <div className="p-2 sm:p-3 rounded-2xl sm:rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto">
          {[
            { id: 'todos', label: 'Todos los Cursos', icon: 'ri-apps-2-line' },
            { id: 'tecnologia', label: 'Tecnología', icon: 'ri-computer-line' },
            { id: 'textil', label: 'Textil y Confección', icon: 'ri-shirt-line' },
            { id: 'gastronomia', label: 'Gastronomía', icon: 'ri-cake-3-line' },
            { id: 'administracion', label: 'Administración', icon: 'ri-briefcase-line' },
            { id: 'automotriz', label: 'Automotriz', icon: 'ri-tools-line' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                category === cat.id
                  ? 'bg-cecati text-white shadow-md shadow-red-900/20 scale-105'
                  : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`${cat.icon} text-base`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/*==================== COURSES GRID ====================*/}
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
              <p className="text-sm font-medium">No se encontraron cursos en esta categoría por el momento.</p>
              <button
                onClick={() => setCategory('todos')}
                className="px-5 py-2.5 rounded-full bg-cecati text-white text-xs font-bold hover:bg-cecati-hover transition-colors"
              >
                Ver todos los cursos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Imagen de Portada con Badge */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-extrabold bg-cecati text-white shadow-md flex items-center gap-1.5">
                        <i className={getCategoryIcon(course.category)}></i>
                        <span className="capitalize">{getCategoryLabel(course.category)}</span>
                      </span>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                          {course.price || '$1,200 MXN'}
                        </span>
                      </div>
                    </div>

                    {/* Detalles del Curso */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-cecati dark:group-hover:text-red-400 transition-colors leading-snug">
                        {course.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <i className="ri-time-line text-cecati dark:text-red-400"></i>
                          <span>{course.duration || '240'} hrs</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <i className="ri-calendar-event-line text-cecati dark:text-red-400"></i>
                          <span>{course.startDate || 'Próximo inicio'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {/* Botón Abrir Detalles */}
                    <button 
                      onClick={() => handleOpenDetails(course)}
                      className="w-full py-3.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Ver Detalles e Inscribirme</span>
                      <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/*==================== MODAL DE DETALLES (z-[100] ELEVADO SOBRE EL HEADER) ====================*/}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in" onClick={handleCloseModal}>
          <div className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[92vh] my-auto" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Limpio con Imagen */}
            <div className="relative h-44 sm:h-52 overflow-hidden shrink-0">
              <img 
                src={selectedCourse.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80'} 
                alt={selectedCourse.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>

              {/* Botón de Cierre Garantizado por encima */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors flex items-center justify-center text-xl cursor-pointer shadow-xl border border-white/20"
                aria-label="Cerrar modal"
              >
                <i className="ri-close-line"></i>
              </button>

              {/* Título e Insignia */}
              <div className="absolute bottom-5 left-6 right-6 z-10 space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cecati text-white shadow-sm">
                    {getCategoryLabel(selectedCourse.category)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md border border-white/20 text-gray-200">
                    Validez Oficial SEP
                  </span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                  {selectedCourse.title}
                </h2>
              </div>
            </div>

            {/* Cuerpo del Modal: Disposición Limpia a 2 Columnas */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Columna Izquierda (Navegación y Contenidos) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Pestañas Minimalistas */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 space-x-4 sm:space-x-6 overflow-x-auto pb-1">
                  {[
                    { id: 'overview', label: 'Visión General', icon: 'ri-briefcase-line' },
                    { id: 'syllabi', label: 'Temario', icon: 'ri-book-open-line' },
                    { id: 'payments', label: 'Pagos', icon: 'ri-calendar-check-line' },
                    { id: 'register', label: 'Pre-Registro', icon: 'ri-user-add-line' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`pb-3 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === tab.id
                          ? 'border-cecati text-cecati dark:text-red-400 dark:border-red-400'
                          : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-white'
                      }`}
                    >
                      <i className={`${tab.icon} text-base`}></i>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Contenido de la Pestaña */}
                <div className="space-y-6 text-gray-700 dark:text-gray-300 text-sm">
                  {/* TAB 1: VISIÓN GENERAL */}
                  {activeTab === 'overview' && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                          <i className="ri-rocket-line text-cecati dark:text-red-400"></i>
                          ¿En qué te capacitará este curso?
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {selectedCourse.profile || 'Este programa te brindará competencias técnicas de nivel industrial para integrarte de forma directa al mercado laboral o emprender tu propio negocio.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1">
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                            <i className="ri-award-line text-emerald-500 text-sm"></i> Validez Nacional SEP
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Diploma oficial con registro en el sistema DGCFT.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-1">
                          <h5 className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
                            <i className="ri-tools-line text-blue-500 text-sm"></i> Talleres Prácticos
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Equipamiento industrial para aprendizaje real.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: TEMARIO */}
                  {activeTab === 'syllabi' && (
                    <div className="space-y-3 animate-fade-in">
                      <h4 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                        <i className="ri-list-check-3 text-cecati dark:text-red-400"></i>
                        Contenido Temático
                      </h4>
                      
                      <div className="space-y-2">
                        {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 ? (
                          selectedCourse.syllabus.map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-cecati text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{item}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">Temario oficial disponible en servicios escolares.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PAGOS */}
                  {activeTab === 'payments' && (
                    <div className="space-y-4 animate-fade-in">
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Inversión Única</span>
                          <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-400">{selectedCourse.price}</h4>
                        </div>
                        <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">
                          Sin costos ocultos
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Fechas de Parcialidades</h5>
                        <div className="space-y-2">
                          {selectedCourse.payments && selectedCourse.payments.length > 0 ? (
                            selectedCourse.payments.map((event, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                                <span className="font-bold text-cecati dark:text-red-400">{event.date}</span>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">{event.title}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Pago único directo en la caja del plantel antes del inicio.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRE-REGISTRO UBICADO EN LA COLUMNA IZQUIERDA (ESPACIOSO) */}
                  {activeTab === 'register' && (
                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-4 animate-fade-in">
                      {registerSuccess ? (
                        <div className="text-center space-y-4 py-3">
                          <i className="ri-checkbox-circle-fill text-6xl text-emerald-500"></i>
                          <h4 className="font-black text-lg text-gray-900 dark:text-white">¡Pre-registro Reservado con Éxito!</h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Hola <strong>{lastRegistered?.fullName}</strong>, tu lugar para el curso de <strong>{selectedCourse.title}</strong> ha sido reservado correctamente en nuestro sistema.
                          </p>
                          
                          <a
                            href={`https://wa.me/524142731601?text=Hola,%20acabo%20de%20realizar%20mi%20pre-registro%20a%20nombre%20de%20${encodeURIComponent(lastRegistered?.fullName || '')}%20para%20el%20curso%20de%20${encodeURIComponent(selectedCourse.title)}.%20Quisiera%20confirmar%20mi%20ficha%20de%20inscripción.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                          >
                            <i className="ri-whatsapp-line text-xl"></i>
                            <span>Enviar Confirmación por WhatsApp</span>
                          </a>

                          <button
                            onClick={() => setRegisterSuccess(false)}
                            className="text-xs text-gray-400 hover:underline block mx-auto pt-2"
                          >
                            Registrar a otra persona
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="font-black text-base text-gray-900 dark:text-white flex items-center gap-2">
                              <i className="ri-user-add-line text-cecati"></i>
                              Formulario de Pre-registro Oficial
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reserva tu lugar en el cupo limitado para <strong>{selectedCourse.title}</strong>.
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Nombre Completo del Aspirante *</label>
                              <input
                                type="text"
                                required
                                placeholder="Ej. Juan Pérez García"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Teléfono o WhatsApp de Contacto *</label>
                              <input
                                type="tel"
                                required
                                placeholder="Ej. 414 123 4567"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">Correo Electrónico (Opcional)</label>
                              <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-cecati"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingReg}
                            className="w-full py-3.5 rounded-xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {submittingReg ? (
                              <>
                                <i className="ri-loader-4-line ri-spin text-lg"></i>
                                <span>Guardando ficha...</span>
                              </>
                            ) : (
                              <span>Confirmar Pre-registro</span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Columna Derecha (Ficha Técnica y Acciones de Conversión Limpias) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-5">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Costo de Inversión</span>
                    <div className="text-3xl font-black text-gray-900 dark:text-white">{selectedCourse.price}</div>
                  </div>

                  <div className="space-y-2.5 text-xs text-gray-600 dark:text-gray-300 border-t border-b border-gray-200 dark:border-gray-600/60 py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Duración:</span>
                      <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.duration} horas</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Fecha de Inicio:</span>
                      <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.startDate}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Horario:</span>
                      <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.schedule}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Requisitos:</span>
                      <strong className="text-gray-900 dark:text-white font-bold">{selectedCourse.requirements}</strong>
                    </div>
                  </div>

                  {/* Acciones Directas Limpias */}
                  <div className="space-y-2.5 pt-1">
                    {/* Botón WhatsApp */}
                    <a
                      href={`https://wa.me/524142731601?text=Hola,%20quisiera%20recibir%20informes%20e%20inscribirme%20al%20curso%20de%20${encodeURIComponent(selectedCourse.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE57] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <i className="ri-whatsapp-line text-lg"></i>
                      <span>Consultar por WhatsApp</span>
                    </a>

                    {/* Pre-registro Toggle */}
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTab === 'register' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-cecati hover:bg-cecati-hover text-white'
                      }`}
                    >
                      <i className="ri-user-add-line text-lg"></i>
                      <span>{activeTab === 'register' ? 'Llenando Pre-Registro...' : 'Apartar Lugar Ahora'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </main>
  );
}
