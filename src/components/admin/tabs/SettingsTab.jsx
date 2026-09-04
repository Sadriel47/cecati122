import { useState, useEffect } from 'react';
import { useSiteConfig } from '../../../context/SiteConfigContext';
import { getCleanWhatsAppNumber } from '../../../services/siteConfigService';

export function SettingsTab({ showToast }) {
  const { config, updateConfig } = useSiteConfig();

  const [formData, setFormData] = useState({
    whatsapp: '',
    facebook: '',
    phone: '',
    email: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    address: '',
    schedule: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        whatsapp: config.whatsapp || '',
        facebook: config.facebook || '',
        phone: config.phone || '',
        email: config.email || '',
        instagram: config.instagram || '',
        youtube: config.youtube || '',
        tiktok: config.tiktok || '',
        address: config.address || '',
        schedule: config.schedule || '',
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConfig(formData);
      if (showToast) showToast(' Configuración de enlaces y contactos guardada exitosamente');
    } catch (err) {
      console.error('Error al guardar la configuración:', err);
      if (showToast) showToast(' Error al guardar los cambios en la base de datos', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cleanWa = getCleanWhatsAppNumber(formData.whatsapp);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 space-y-8 animate-fade-in">
      {/* Header del apartado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 text-cecati dark:text-red-400 text-xs font-bold mb-2">
            <i className="ri-settings-4-line text-sm"></i>
            <span>Gestión del Sitio</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Configuración de Contacto y Enlaces Sociales
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Actualiza el número de WhatsApp, la página de Facebook y los canales de comunicación de todo el sitio web en tiempo real.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3.5 rounded-2xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
        >
          {saving ? (
            <>
              <i className="ri-loader-4-line ri-spin text-lg"></i>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <i className="ri-save-3-line text-lg"></i>
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BLOQUE PRINCIPAL: WhatsApp y Facebook */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Directo */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <i className="ri-whatsapp-line text-xl"></i>
              <span>Número de WhatsApp para Informes</span>
            </div>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              Número de 10 dígitos o formato internacional para enlaces de chats.
            </p>
            <input
              type="text"
              name="whatsapp"
              required
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Ej: 4426617408"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-emerald-300 dark:border-emerald-700 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {cleanWa && (
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <i className="ri-link text-xs"></i>
                <span>Link generado: https://wa.me/{cleanWa}</span>
              </div>
            )}
          </div>

          {/* Página Oficial de Facebook */}
          <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 space-y-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
              <i className="ri-facebook-circle-fill text-xl"></i>
              <span>Página Oficial de Facebook</span>
            </div>
            <p className="text-xs text-blue-800/80 dark:text-blue-300/80">
              URL completa de la página oficial de Facebook de CECATI 122.
            </p>
            <input
              type="url"
              name="facebook"
              required
              value={formData.facebook}
              onChange={handleChange}
              placeholder="Ej: https://www.facebook.com/cecati122"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-700 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* BLOQUE SECUNDARIO: Canales Telefónicos y Correos */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i className="ri-phone-find-line text-cecati dark:text-red-400"></i>
            <span>Contacto Telefónico y Electrónico</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Teléfono Fijo de Atención
              </label>
              <div className="relative">
                <i className="ri-phone-line absolute left-3.5 top-3.5 text-gray-400"></i>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: +52 442 661 7408"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Correo Electrónico Institucional
              </label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3.5 top-3.5 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ej: cecati122.dir@dgcft.sems.gob.mx"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE TERCERO: Otras Redes Sociales */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i className="ri-share-line text-cecati dark:text-red-400"></i>
            <span>Redes Sociales Adicionales</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Instagram URL
              </label>
              <div className="relative">
                <i className="ri-instagram-line absolute left-3.5 top-3.5 text-pink-500"></i>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://www.instagram.com/cecati122tx/"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                YouTube URL
              </label>
              <div className="relative">
                <i className="ri-youtube-line absolute left-3.5 top-3.5 text-red-600"></i>
                <input
                  type="url"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/@cecati122"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                TikTok URL
              </label>
              <div className="relative">
                <i className="ri-tiktok-line absolute left-3.5 top-3.5 text-gray-900 dark:text-white"></i>
                <input
                  type="url"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleChange}
                  placeholder="https://www.tiktok.com/@cecati122"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE CUARTO: Dirección y Horario */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i className="ri-map-pin-line text-cecati dark:text-red-400"></i>
            <span>Ubicación y Horario del Plantel</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Dirección Física Resumida
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Av. Venustiano Carranza 22, Tequisquiapan, Qro."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Horario de Atención Público
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="Lun - Vie: 7:00 am - 9:00 pm | Sáb: 7:00 am - 1:00 pm"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cecati"
              />
            </div>
          </div>
        </div>

        {/* Botón de envío inferior */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 rounded-2xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:shadow-red-900/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <i className="ri-loader-4-line ri-spin text-lg"></i>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <i className="ri-save-3-line text-lg"></i>
                <span>Guardar Todos los Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
