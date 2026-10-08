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
    // Datos Bancarios
    bankName: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankClabe: '',
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
        bankName: config.bankName || 'BANORTE',
        bankAccountHolder: config.bankAccountHolder || 'CECATI 122',
        bankAccountNumber: config.bankAccountNumber || '1056897860',
        bankClabe: config.bankClabe || '',
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si es CLABE, podemos filtrar solo dígitos hasta 18 caracteres
    if (name === 'bankClabe') {
      const sanitized = value.replace(/\D/g, '').slice(0, 18);
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateConfig(formData);
      if (showToast) showToast(' Configuración y datos bancarios guardados exitosamente');
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
            <span>Gestión del Sitio y Pagos</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            Configuración de Contacto, Redes y Cuenta Bancaria
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Administra los canales de comunicación, redes sociales y los datos de depósito bancario para inscripciones de alumnos en tiempo real.
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
        {/* NUEVA SECCIÓN: Información de Cuenta Bancaria para Pagos */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-red-50/70 via-rose-50/40 to-white dark:from-red-950/30 dark:via-gray-800 dark:to-gray-800 border-2 border-red-200/80 dark:border-red-900/50 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-red-100 dark:border-red-900/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cecati text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-900/20">
                <i className="ri-bank-card-fill"></i>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Información de Cuenta Bancaria para Pagos
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Estos datos se mostrarán en la ficha de inscripción, pestaña de pagos y recordatorios de depósito de todos los cursos.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-cecati/10 text-cecati dark:text-red-300">
              Pago Oficial CECATI 122
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banco */}
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Institución Bancaria / Banco <span className="text-cecati">*</span>
              </label>
              <div className="relative">
                <i className="ri-bank-line absolute left-3.5 top-3.5 text-gray-400 text-base"></i>
                <input
                  type="text"
                  name="bankName"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Ej: BANORTE, BBVA, Santander, etc."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Nombre de la institución bancaria donde los alumnos realizarán el depósito o transferencia.
              </span>
            </div>

            {/* Titular de la Cuenta */}
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Titular / Beneficiario de la Cuenta <span className="text-cecati">*</span>
              </label>
              <div className="relative">
                <i className="ri-user-star-line absolute left-3.5 top-3.5 text-gray-400 text-base"></i>
                <input
                  type="text"
                  name="bankAccountHolder"
                  required
                  value={formData.bankAccountHolder}
                  onChange={handleChange}
                  placeholder="Ej: CECATI 122 o Centro de Capacitación..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Nombre oficial o razón social que debe aparecer como destinatario del pago.
              </span>
            </div>

            {/* Número de Cuenta */}
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Número de Cuenta Bancaria <span className="text-cecati">*</span>
              </label>
              <div className="relative">
                <i className="ri-hashtag absolute left-3.5 top-3.5 text-gray-400 text-base"></i>
                <input
                  type="text"
                  name="bankAccountNumber"
                  required
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  placeholder="Ej: 1056897860"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati"
                />
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Número de cuenta tradicional para depósitos en ventanilla o cajero automático.
              </span>
            </div>

            {/* CLABE Interbancaria */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                  CLABE Interbancaria (Transferencias SPEI)
                </label>
                <span className={`text-[11px] font-mono font-bold ${formData.bankClabe.length === 18 ? 'text-emerald-600 dark:text-emerald-400' : formData.bankClabe.length > 0 ? 'text-amber-500' : 'text-gray-400'}`}>
                  {formData.bankClabe.length}/18 dígitos
                </span>
              </div>
              <div className="relative">
                <i className="ri-arrow-left-right-line absolute left-3.5 top-3.5 text-gray-400 text-base"></i>
                <input
                  type="text"
                  name="bankClabe"
                  value={formData.bankClabe}
                  onChange={handleChange}
                  maxLength={18}
                  placeholder="Ej: 072680010568978602 (18 dígitos)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-mono font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati tracking-wider"
                />
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Clave estandarizada de 18 dígitos para transferencias electrónicas SPEI desde cualquier banco o app móvil.
              </span>
            </div>
          </div>

          {/* Vista previa de cómo lo verán los alumnos */}
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-red-200/60 dark:border-gray-700 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
              Vista Previa en el Portal del Alumno:
            </span>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-900 to-cecati text-white space-y-3 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-extrabold tracking-widest text-red-200">
                  Depósito / Transferencia Bancaria
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-bold text-xs uppercase">
                  {formData.bankName || 'BANCO'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                  <span className="text-[10px] text-red-200 block font-semibold">Número de Cuenta:</span>
                  <strong className="text-lg font-mono font-black">{formData.bankAccountNumber || '••••••••••'}</strong>
                </div>
                {formData.bankClabe && (
                  <div className="p-2.5 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                    <span className="text-[10px] text-red-200 block font-semibold">CLABE Interbancaria (SPEI):</span>
                    <strong className="text-base font-mono font-black">{formData.bankClabe}</strong>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-red-100 flex items-center gap-1.5 pt-0.5">
                <i className="ri-shield-check-line"></i>
                <span>Titular: <strong>{formData.bankAccountHolder || 'CECATI 122'}</strong></span>
              </div>
            </div>
          </div>
        </div>

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

