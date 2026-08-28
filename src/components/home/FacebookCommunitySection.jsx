import colors from '../../theme/colors';

export function FacebookCommunitySection() {
  return (
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
  );
}
