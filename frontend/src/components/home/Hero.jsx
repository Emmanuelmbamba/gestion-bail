  import SearchBox from "./SearchBox";

  export default function Hero() {
    return (
      <section className="relative bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white py-16 md:py-28 overflow-hidden">
        {/* Background visual details */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative container mx-auto px-6 text-center max-w-4xl">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 rounded-full border border-blue-500/20">
            Plateforme Immobilière Intelligente
          </span>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            Trouvez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-emerald-400">logement idéal</span> en quelques clics
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection exclusive d'appartements, maisons, villas de prestige et terrains de choix disponibles immédiatement à la location.
          </p>

          <div className="w-full max-w-3xl mx-auto transform hover:-translate-y-1 transition-transform duration-300">
            <SearchBox />
          </div>
        </div>
      </section>
    );
  }