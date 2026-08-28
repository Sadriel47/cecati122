import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const SOCIAL_LINKS = [
  {
    name: 'Facebook Oficial',
    url: 'https://www.facebook.com/cecati122',
    icon: 'ri-facebook-fill',
  },
  {
    name: 'WhatsApp Directo',
    url: 'https://wa.me/524142731601?text=Hola,%20quisiera%20recibir%20información%20sobre%20los%20cursos',
    icon: 'ri-whatsapp-line',
  },
  {
    name: 'YouTube Oficial',
    url: 'https://www.youtube.com/@cecati122',
    icon: 'ri-youtube-fill',
  },
  {
    name: 'Instagram Oficial',
    url: 'https://www.instagram.com/cecati122',
    icon: 'ri-instagram-line',
  },
];

export function HeroSection({ totalCount }) {
  return (
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
          <div className="relative overflow-hidden rounded-3xl p-2 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Botonera Flotante de Redes Sociales */}
            <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-zinc-950/60 backdrop-blur-md border border-white/10 shadow-lg">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/15 transition-all duration-200 text-base"
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>

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
  );
}
