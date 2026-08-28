import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export function TestimonialsSection({ testimonials }) {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300" id="testimonios">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cecati dark:text-red-400 mb-2 block">
            Testimonios Reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Experiencias de Nuestros Alumnos
          </h2>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 grid grid-cols-1 md:grid-cols-12 border border-gray-100 dark:border-gray-700">
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
              <button className="swiper-button-prev-custom w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white shadow flex items-center justify-center hover:bg-cecati hover:text-white transition-colors cursor-pointer">
                <i className="ri-arrow-left-line"></i>
              </button>
              <button className="swiper-button-next-custom w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white shadow flex items-center justify-center hover:bg-cecati hover:text-white transition-colors cursor-pointer">
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
