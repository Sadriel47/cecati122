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
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden border-b border-zinc-200/80 dark:border-transparent" id="home">
      {/* Background Image */}
      <img
        src="/assets/img/home.jpg"
        alt="CECATI 122 Instalaciones"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Backdrop Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85 backdrop-blur-md"></div>
      <div className="hidden dark:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent backdrop-blur-sm pointer-events-none z-10"></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Main Hero Data */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          {/* Official SEP Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs md:text-sm font-semibold text-white shadow-lg shadow-black/20">
            <i className="ri-award-line text-red-400 text-lg"></i>
            <span>Educación Técnica Oficial | DGCFT - SEP</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
            Inscripciones abiertas <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">CECATI 122</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-300 max-w-xl leading-relaxed mt-4 mx-auto lg:mx-0">
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
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 py-3 px-5 rounded-2xl">
            <div className="text-center p-2">
              <span className="block text-xl sm:text-2xl font-bold text-white">+{totalCount}</span>
              <span className="text-[11px] sm:text-xs font-medium text-zinc-400 tracking-normal">Cursos Oficiales</span>
            </div>
            <div className="text-center p-2">
              <span className="block text-xl sm:text-2xl font-bold text-white">SEP</span>
              <span className="text-[11px] sm:text-xs font-medium text-zinc-400 tracking-normal">Validez Nacional</span>
            </div>
            <div className="text-center p-2">
              <span className="block text-xl sm:text-2xl font-bold text-white">+40</span>
              <span className="text-[11px] sm:text-xs font-medium text-zinc-400 tracking-normal">Años de Historia</span>
            </div>
            <div className="text-center p-2">
              <span className="block text-xl sm:text-2xl font-bold text-white">100%</span>
              <span className="text-[11px] sm:text-xs font-medium text-zinc-400 tracking-normal">Taller Práctico</span>
            </div>
          </div>
        </div>

        {/* Hero Swiper Gallery */}
        <div className="lg:col-span-5 w-full max-w-sm mx-auto lg:max-w-none relative">
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-600/20 to-amber-600/10 rounded-3xl blur-2xl -z-10 opacity-70 pointer-events-none"></div>

          <div className="relative overflow-hidden rounded-3xl p-2 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
            {/* Botonera Flotante de Redes Sociales */}
            <div className="absolute top-3 right-3 z-20 bg-zinc-950/75 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-xl flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="text-zinc-300 hover:text-rose-400 hover:scale-110 transition-all duration-200 text-base"
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
                <div className="relative min-h-[380px] lg:min-h-[420px] aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src="/assets/img/home-img-2.jpg" alt="Aulas y Equipamiento" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30 pointer-events-none"></div>
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white text-xs font-semibold">
                    <span>Aulas y Equipamiento Especializado</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative min-h-[380px] lg:min-h-[420px] aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src="/assets/img/home-img-3.jpg" alt="Estudiantes en Capacitación" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30 pointer-events-none"></div>
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white text-xs font-semibold">
                    <span>Aprendizaje 100% Práctico</span>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="relative min-h-[380px] lg:min-h-[420px] aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src="/assets/img/home-img-4.jpg" alt="Docentes Calificados" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-zinc-950/30 pointer-events-none"></div>
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white text-xs font-semibold">
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
