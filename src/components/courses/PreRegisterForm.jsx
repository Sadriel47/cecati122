import { RegistrationSuccessState } from './RegistrationSuccessState';

export function PreRegisterForm({
  selectedCourse,
  registerSuccess,
  setRegisterSuccess,
  lastRegistered,
  formData,
  setFormData,
  honeypot,
  setHoneypot,
  regError,
  submittingReg,
  handleRegisterSubmit
}) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-4 animate-fade-in">
      {registerSuccess ? (
        <RegistrationSuccessState
          lastRegistered={lastRegistered}
          selectedCourse={selectedCourse}
          onReset={() => setRegisterSuccess(false)}
        />
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="space-y-1 border-b border-gray-200 dark:border-gray-600 pb-3">
            <h4 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <i className="ri-user-add-line text-cecati dark:text-red-400 text-xl"></i>
              Formulario de Pre-registro Oficial
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Reserva tu lugar para <strong>{selectedCourse.title}</strong> en 30 segundos.
            </p>
          </div>

          {/* Honeypot Anti-bots Invisible */}
          <input
            type="text"
            name="empresa_o_sitio"
            tabIndex="-1"
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="opacity-0 absolute -z-10 pointer-events-none w-0 h-0 p-0 m-0 overflow-hidden"
          />

          {regError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-300 flex items-center gap-2">
              <i className="ri-error-warning-line text-lg"></i>
              <span>{regError}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Nombre Completo del Aspirante *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez García"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-base sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Teléfono o WhatsApp de Contacto (10 dígitos) *
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. 442 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-base sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Correo Electrónico (Opcional)
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-base sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cecati font-medium"
              />
            </div>
          </div>

          {/* Recordatorio de depósito BANORTE */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-1 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-extrabold text-amber-800 dark:text-amber-300">
              <i className="ri-information-line text-base"></i>
              <span>Recordatorio de Inscripción:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Presenta tus copias (Acta, CURP, Comprobante de estudios, Domicilio, 2 fotos infantil) y comprobante de pago en BANORTE (Cuenta: <strong>1056897860</strong>).
            </p>
          </div>

          <button
            type="submit"
            disabled={submittingReg}
            className="w-full py-4 rounded-2xl bg-cecati hover:bg-cecati-hover text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-900/30 hover:shadow-red-900/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            {submittingReg ? (
              <>
                <i className="ri-loader-4-line ri-spin text-xl"></i>
                <span>Guardando ficha...</span>
              </>
            ) : (
              <>
                <i className="ri-check-double-line text-xl"></i>
                <span>Confirmar Pre-registro</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

