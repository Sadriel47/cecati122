import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { getCourses, getCourseCount, getTestimonials } from '../services/db';
import { getPosts } from '../services/postsService';
import colors from '../theme/colors';

// Import Swiper styles in React
import 'swiper/css';
import 'swiper/css/navigation';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [totalCount, setTotalCount] = useState(() => {
    const cached = localStorage.getItem('cecati_course_count');
    return cached ? parseInt(cached, 10) : 35;
  });

  useEffect(() => {
    document.title = "CECATI 122 - Inicio";
    const fetchData = async () => {
      try {
        const data = await getCourses();
        setCourses(data.slice(0, 3)); // Show top 3 featured courses
        const count = await getCourseCount();
        setTotalCount(count);
        
        // Cargar últimas 3 noticias activas
        const postsData = await getPosts('Todas');
        setRecentPosts(postsData.slice(0, 3));

        // Cargar testimonios dinámicos del administrador
        const testimonialsData = await getTestimonials();
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="main overflow-hidden">
      {/*==================== HERO SECTION ====================*/}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden" id="home">
        {/* Background Image */}
        <img 
          src="/assets/img/home.jpg" 
          alt="CECATI 122 Instalaciones" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
        />
        {/* Backdrop Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85 backdrop-blur-md"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Data */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Official SEP Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs md:text-sm font-semibold text-white shadow-lg shadow-black/20">
              <i className="ri-award-line text-red-400 text-lg"></i>
              <span>Educación Técnica Oficial | DGCFT - SEP</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Impulsa tu futuro laboral en el <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">CECATI 122</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
              Capacitación técnica de alta calidad con certificaciones oficiales de la SEP para potenciar tu perfil profesional y emprendimiento.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                to="/cursos" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cecati text-white font-bold text-sm sm:text-base shadow-xl shadow-red-900/40 hover:bg-cecati-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Explorar Cursos</span>
                <i className="ri-arrow-right-line text-lg"></i>
              </Link>

              <Link 
                to="/nosotros" 
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-sm sm:text-base hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Conóce el Plantel</span>
                <i className="ri-information-line text-lg"></i>
              </Link>
            </div>

            {/* Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl mt-8">
              <div className="text-center p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">+{totalCount}</span>
                <span className="text-xs text-gray-300 font-medium">Cursos Oficiales</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">SEP</span>
                <span className="text-xs text-gray-300 font-medium">Validez Nacional</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">+40</span>
                <span className="text-xs text-gray-300 font-medium">Años de Historia</span>
              </div>
              <div className="text-center p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">100%</span>
                <span className="text-xs text-gray-300 font-medium">Taller Práctico</span>
              </div>
            </div>
          </div>

          {/* Hero Swiper Gallery */}
          <div className="lg:col-span-5 w-full max-w-sm mx-auto lg:max-w-none">
            <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
              <Swiper
                modules={[Autoplay]}
                loop={true}
                spaceBetween={16}
                grabCursor={true}
                slidesPerView={1}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                className="rounded-2xl overflow-hidden"
              >
                <SwiperSlide>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src="/assets/img/home-img-2.jpg" alt="Aulas y Equipamiento" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-semibold">
                      <span>Aulas y Equipamiento Especializado</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src="/assets/img/home-img-3.jpg" alt="Estudiantes en Capacitación" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-semibold">
                      <span>Aprendizaje 100% Práctico</span>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src="/assets/img/home-img-4.jpg" alt="Docentes Calificados" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-xs font-semibold">
                      <span>Instructores Expertos Certificados</span>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/*==================== CURSOS DESTACADOS ====================*/}
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
              <article 
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700/60 flex flex-col" 
                key={course.id}
              >
                {/* Course Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
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

                  <Link 
                    to="/cursos" 
                    className="inline-flex items-center justify-between w-full pt-4 border-t border-gray-100 dark:border-gray-700 text-xs font-bold text-cecati dark:text-red-400 group-hover:translate-x-1 transition-all"
                  >
                    <span>Ver Detalles y Temario</span>
                    <i className="ri-arrow-right-line text-sm"></i>
                  </Link>
                </div>
              </article>
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

      {/*==================== TESTIMONIALES ====================*/}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="testimonios">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cecati dark:text-red-400 mb-2 block">
              Testimonios Reales
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Experiencias de Nuestros Alumnos
            </h2>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-gray-50 dark:bg-gray-800 grid grid-cols-1 md:grid-cols-12 border border-gray-100 dark:border-gray-700">
            <div className="md:col-span-5 relative min-h-[260px]">
              <img 
                src="/assets/img/home.jpg" 
                alt="Alumnos en Clase" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/40"></div>
            </div>

            <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center relative">
              <i className="ri-double-quotes-l text-5xl text-cecati opacity-20 absolute top-6 right-8"></i>
              
              <Swiper
                modules={[Navigation]}
                grabCursor={true}
                slidesPerView={1}
                spaceBetween={20}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className="w-full"
              >
                {testimonials.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="space-y-4">
                      {/* Rating Stars */}
                      <div className="flex text-amber-400 gap-1 text-sm">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <i key={i} className="ri-star-fill"></i>
                        ))}
                      </div>

                      {/* Título de la reseña */}
                      {item.title && (
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          "{item.title}"
                        </h3>
                      )}

                      {/* Comentario / Testimonio */}
                      <p className="text-gray-600 dark:text-gray-300 italic text-sm sm:text-base leading-relaxed">
                        "{item.comment}"
                      </p>

                      {/* Perfil del Estudiante */}
                      <div className="flex items-center gap-3 pt-2">
                        <img 
                          src={item.avatar || "/assets/img/testimonial-profile-1.png"} 
                          alt={item.studentName} 
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-cecati" 
                        />
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.studentName}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{item.roleOrCourse}</p>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="swiper-button-prev-custom w-9 h-9 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow flex items-center justify-center hover:bg-cecati hover:text-white transition-colors">
                  <i className="ri-arrow-left-line"></i>
                </button>
                <button className="swiper-button-next-custom w-9 h-9 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white shadow flex items-center justify-center hover:bg-cecati hover:text-white transition-colors">
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*==================== CERTIFICACIONES ====================*/}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300" id="certificaciones">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-cecati dark:text-red-400 mb-2 block">
              Respaldo Institucional
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Nuestras Certificaciones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-cecati dark:text-red-400 flex items-center justify-center text-2xl font-bold">
                <i className="ri-government-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Validez Oficial SEP
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Todos nuestros cursos otorgan diplomas y constancias con validez oficial de la Secretaría de Educación Pública a nivel nacional.
              </p>
            </article>

            <article className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold">
                <i className="ri-verified-badge-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Evaluación CONOCER
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Certifica tus competencias laborales mediante el Consejo Nacional de Normalización y Certificación de Competencias Laborales.
              </p>
            </article>

            <article className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 p-6 space-y-4 border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
                <i className="ri-briefcase-line"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Reconocimiento Laboral
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Acredita tus conocimientos prácticos con documentos oficiales que potencian tu empleabilidad ante el sector productivo.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/*==================== AVISOS Y NOTICIAS RECIENTES ====================*/}
      {recentPosts.length > 0 && (
        <section className="py-20 bg-slate-50 dark:bg-[#0D0D0E] transition-colors duration-300 border-t border-slate-100 dark:border-slate-800/60" id="noticias">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B41A47] dark:text-red-400 mb-2 block">
                  Información Institucional
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Avisos y Noticias Recientes
                </h2>
              </div>
              <Link
                to="/blog"
                className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold text-[#B41A47] hover:text-[#d62828] transition-colors group"
              >
                <span>Ver todas las publicaciones</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col bg-white dark:bg-[#161618] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#2A2A2E] shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                        <i className="ri-calendar-line"></i>
                        <span>{post.publishedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#B41A47] transition-colors line-clamp-2 mb-3">
                        <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <Link
                      to={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#B41A47] hover:underline pt-3 border-t border-slate-100 dark:border-slate-800"
                    >
                      <span>Leer aviso completo</span>
                      <i className="ri-arrow-right-s-line"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*==================== PUBLICACIONES RECIENTES (FACEBOOK) ====================*/}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300" id="facebook">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <i className="ri-facebook-circle-fill text-3xl" style={{ color: colors.social.facebook }}></i>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Comunidad CECATI 122</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            Mantente al día con avisos de inscripción, fechas de inicio de cursos y eventos en nuestra página oficial de Facebook.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl inline-block border border-gray-100 dark:border-gray-700">
            <div 
              className="fb-page overflow-hidden rounded-xl" 
              data-href="https://www.facebook.com/cecati122" 
              data-tabs="timeline" 
              data-width="500"
              data-height="550" 
              data-small-header="false" 
              data-adapt-container-width="true" 
              data-hide-cover="false"
              data-show-facepile="true"
            >
              <blockquote cite="https://www.facebook.com/cecati122" className="fb-xfbml-parse-ignore">
                <a href="https://www.facebook.com/cecati122">CECATI 122 en Facebook</a>
              </blockquote>
            </div>
          </div>

          <div className="mt-8">
            <a 
              href="https://www.facebook.com/cecati122" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: colors.social.facebook }}
            >
              <i className="ri-facebook-fill text-lg"></i>
              <span>Visitar Página Oficial en Facebook</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
