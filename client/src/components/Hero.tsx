import { Trophy, Zap, Users, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-white/90 font-sans font-medium text-sm sm:text-base uppercase tracking-wide">
                Live Tournament Management
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-tight uppercase tracking-tight">
              Gestisci i tuoi{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Tornei
              </span>
              <br />
              in Tempo Reale
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-sans font-normal leading-relaxed">
              Crea tornei, gestisci squadre, traccia risultati e classifiche.
              <br className="hidden sm:block" />
              Tutto in un'unica piattaforma moderna e professionale.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Gestione Tornei</h3>
              <p className="text-white/80 font-sans">
                Crea e gestisci tornei completi con facilità
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Squadre & Giocatori</h3>
              <p className="text-white/80 font-sans">
                Traccia performance di squadre e giocatori
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transition-all duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white mb-2">Classifiche Live</h3>
              <p className="text-white/80 font-sans">
                Classifiche aggiornate in tempo reale
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
                fill="currentColor" 
                className="text-slate-50 dark:text-slate-950"
          />
        </svg>
      </div>
    </section>
  );
}
