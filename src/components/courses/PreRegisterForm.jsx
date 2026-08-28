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
    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 space-y-4 animate-fade-in">
      {registerSuccess ? (
        <RegistrationSuccessState
          lastRegistered={lastRegistered}
          selectedCourse={selectedCourse}
          onReset={() => setRegisterSuccess(false)}
        />
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
  );
}
