import { useEffect } from 'react';

export default function Nosotros() {
  useEffect(() => {
    document.title = "Nosotros - CECATI 122";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="main overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/*==================== HERO NOSOTROS ====================*/}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden border-b border-zinc-200/80 dark:border-transparent" id="home">
        {/* Background Image */}
        <img
          src="/assets/img/home.jpg"
          alt="CECATI 122 Instalaciones"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 backdrop-blur-md"></div>
        <div className="hidden dark:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent backdrop-blur-sm pointer-events-none z-10"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold text-white shadow-lg">
            <i className="ri-building-4-line text-red-400 text-lg"></i>
            <span>Plantel Educativo Oficial | Tequisquiapan, Qro.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            Acerca del <span className="bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">CECATI 122</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Más de cuatro décadas capacitando talento técnico e impulsando la inserción laboral y el emprendimiento en México.
          </p>
        </div>
      </section>

      {/*==================== NOSOTROS SECTION ====================*/}
      <section className="py-16 sm:py-24 px-4" id="nosotros">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* Conoce la DGCFT */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700/60 transition-colors duration-300">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--cecati-color)] dark:text-red-400 mb-2 block">
                Dependencia de la SEP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Conoce la DGCFT
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Formación técnica y profesional para el trabajo desde 1963
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                <p>
                  La <strong className="text-gray-900 dark:text-white font-semibold">Dirección General de Centros de Formación para el Trabajo (DGCFT)</strong> es una Unidad Administrativa adscrita a la Subsecretaría de Educación Media Superior (SEMS) de la Secretaría de Educación Pública (SEP), ofreciendo capacitación oficial desde 1963.
                </p>
                <p>
                  Nuestros programas están diseñados para personas de <strong className="text-gray-900 dark:text-white font-semibold">15 años en adelante</strong>, bajo un esquema eminentemente práctico (<strong className="text-[var(--cecati-color)] dark:text-red-400 font-semibold">80% práctico y 20% teórico</strong>), asegurando que el alumno adquiera habilidades reales desde la primera clase.
                </p>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 flex items-center justify-center max-w-xs w-full shadow-inner">
                  <img src="/assets/img/dgcft.png" alt="Logotipo Oficial DGCFT" className="max-h-24 object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* Objetivo General Callout */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[var(--cecati-color)] to-red-700 text-white p-8 sm:p-12 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                <i className="ri-compass-3-line"></i>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Objetivo General</h3>
            </div>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed font-light max-w-4xl">
              Dirigir y coordinar la prestación del servicio de capacitación para y en el trabajo, con el firme propósito de brindar competencias, conocimientos y habilidades indispensables para una inserción exitosa en el mercado laboral y el desarrollo económico regional.
            </p>
          </div>

          {/* Objetivos Específicos */}
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Objetivos Específicos
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Pilares estratégicos que guían nuestra labor educativa diaria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Adaptabilidad y Mejora", text: "Contribuir a la empleabilidad continua de alumnos de 15 años en adelante." },
                { title: "Innovación Curricular", text: "Desarrollar y actualizar constantemente planes de estudio adaptados al mercado." },
                { title: "Profesionalización", text: "Fortalecer la capacitación y superación constante del personal docente y directivo." },
                { title: "Transparencia de Recursos", text: "Optimizar recursos institucionales dentro de un marco de honestidad y legalidad." },
                { title: "Vínculos Interinstitucionales", text: "Reforzar alianzas con los sectores productivos, empresariales y gubernamentales." },
                { title: "Uso de Tecnologías (TIC)", text: "Integrar plataformas sustentables e innovadoras de aprendizaje digital." },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 flex items-start gap-4">
                  <i className="ri-checkbox-circle-fill text-2xl text-[var(--cecati-color)] dark:text-red-400 shrink-0 mt-0.5"></i>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misión y Visión */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700/60 space-y-4 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 text-[var(--cecati-color)] dark:text-red-400 flex items-center justify-center text-3xl font-bold">
                <i className="ri-flag-3-line"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Misión</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Somos una institución pública de la SEP enfocada en brindar Formación para el Trabajo de calidad a personas de 15 años y más, impulsando la equidad, inclusión, empleabilidad y el emprendimiento a lo largo de la vida.
              </p>
            </div>

            {/* Visión */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700/60 space-y-4 hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl font-bold">
                <i className="ri-eye-line"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Visión</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                Consolidarnos como la institución líder reconocida a nivel regional y estatal por la excelencia en la formación técnica para el trabajo, caracterizándonos por el compromiso social, la innovación y la calidad docente.
              </p>
            </div>
          </div>

          {/* Estadísticas Clave */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 text-white shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-700">
              <div className="pt-4 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-red-400 mb-1">+43</span>
                <span className="text-sm font-medium text-gray-300">Años de Trayectoria Institucional</span>
              </div>
              <div className="pt-4 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-white mb-1">15+</span>
                <span className="text-sm font-medium text-gray-300">Especialidades Técnicas</span>
              </div>
              <div className="pt-4 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-red-400 mb-1">+56,000</span>
                <span className="text-sm font-medium text-gray-300">Egresados Certificados</span>
              </div>
            </div>
          </div>

          {/* Ubicación y Contacto */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700/60" id="contacto">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--cecati-color)] dark:text-red-400 mb-2 block">
                Ubicación y Atención
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Visita Nuestro Plantel
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Información de contacto */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-[var(--cecati-color)] dark:text-red-400 flex items-center justify-center text-xl font-bold shrink-0">
                    <i className="ri-map-pin-2-fill"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Dirección</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                      Av. Venustiano Carranza 22, Adolfo López Mateos, Tequisquiapan, Qro., México C.P. 76750
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold shrink-0">
                    <i className="ri-phone-fill"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Teléfono</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      +52 414 273 1601
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold shrink-0">
                    <i className="ri-time-line"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Horario de Atención</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                      Lunes a Viernes: 7:00 am - 9:00 pm<br />
                      Sábados: 7:00 am - 1:00 pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl font-bold shrink-0">
                    <i className="ri-mail-fill"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Correo Electrónico</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 break-all">
                      cecati122.dir@dgcft.sems.gob.mx
                    </p>
                  </div>
                </div>
              </div>

              {/* Map iFrame */}
              <div className="lg:col-span-7 h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d8319.81455718384!2d-99.899431!3d20.521861!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d39e07959270a7%3A0x40a0708822ff8ff4!2sCECATI%20122%20DGCFT!5e1!3m2!1ses-419!2sbo!4v1755986311751!5m2!1ses-419!2sbo"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Google Maps CECATI 122"
                >
                </iframe>
              </div>
            </div>
          </div>

          {/* Banner Instalaciones */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 sm:h-96">
            <img src="/assets/img/home.jpg" alt="Instalaciones CECATI 122" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8 sm:p-12">
              <div className="text-white space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                  Instalaciones de Excelencia
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold">Talleres Equipados para la Formación Práctica</h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-light">
                  Espacios de trabajo adaptados a los requerimientos actuales del sector industrial y de servicios.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
