export function ConfirmModal({ confirmModal, setConfirmModal }) {
  if (!confirmModal || !confirmModal.open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setConfirmModal({ ...confirmModal, open: false })}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700 text-center space-y-4 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
          <i className="ri-error-warning-line"></i>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-gray-900 dark:text-white">
            {confirmModal.title || '¿Estás seguro?'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {confirmModal.message}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => setConfirmModal({ ...confirmModal, open: false })}
            className="px-5 py-2.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={async () => {
              if (confirmModal.onConfirm) {
                await confirmModal.onConfirm();
              }
              setConfirmModal({ ...confirmModal, open: false });
            }}
            className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-900/30 transition-all cursor-pointer"
          >
            {confirmModal.actionText || 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
