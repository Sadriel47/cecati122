export function StatsRibbon({ totalCount = 35 }) {
  return (
    <section className="py-10 sm:py-14 bg-zinc-900/90 dark:bg-zinc-950 border-y border-zinc-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/60">
          <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
            <span className="block text-3xl sm:text-4xl font-black text-white tracking-tight">
              +{totalCount}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-400">
              Cursos Oficiales
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
            <span className="block text-3xl sm:text-4xl font-black text-white tracking-tight">
              SEP
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-400">
              Validez Nacional
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
            <span className="block text-3xl sm:text-4xl font-black text-white tracking-tight">
              +40
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-400">
              Años de Historia
            </span>
          </div>

          <div className="pt-4 sm:pt-0 sm:px-4 space-y-1">
            <span className="block text-3xl sm:text-4xl font-black text-white tracking-tight">
              100%
            </span>
            <span className="text-xs sm:text-sm font-semibold text-zinc-400">
              Taller Práctico
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
