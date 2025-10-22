import { Button } from "@/components/ui/button";
import { Trophy, Play, Sparkles } from "lucide-react";
import heroImage from "@assets/generated_images/Football_stadium_celebration_scene_b84a032b.png";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden" data-testid="section-hero">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-emerald-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Gestione Tornei Professionali</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight" data-testid="text-hero-title">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent">
              Gestisci i tuoi tornei
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              in tempo reale
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-2xl leading-relaxed" data-testid="text-hero-subtitle">
            La piattaforma completa per organizzare tornei di calcio. 
            Gestisci partite, classifiche e statistiche con facilità e stile.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105" 
              data-testid="button-get-started"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Inizia Ora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all hover:scale-105"
              data-testid="button-view-demo"
            >
              <Play className="w-5 h-5 mr-2" />
              Guarda Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">100+</div>
              <div className="text-sm text-slate-400">Tornei Gestiti</div>
            </div>
            <div className="text-center border-x border-white/10">
              <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm text-slate-400">Squadre Attive</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-sm text-slate-400">Live Updates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
