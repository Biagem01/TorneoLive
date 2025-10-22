import { Button } from "@/components/ui/button";
import { Trophy, Play, Sparkles, ArrowRight, Zap } from "lucide-react";
import heroImage from "@assets/generated_images/Football_stadium_celebration_scene_b84a032b.png";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" data-testid="section-hero">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/92 to-emerald-950/85" />
      
      {/* Accent Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/25 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent" />
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/30 mb-8 backdrop-blur-xl shadow-xl shadow-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span className="text-sm font-black text-emerald-300 tracking-wide">PIATTAFORMA PROFESSIONALE</span>
            <Zap className="w-5 h-5 text-teal-400" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100" data-testid="text-hero-title">
            <span className="block bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Gestisci i tuoi
            </span>
            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl">
              Tornei di Calcio
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl mt-4 bg-gradient-to-r from-white/90 to-slate-300 bg-clip-text text-transparent">
              in Tempo Reale
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200" data-testid="text-hero-subtitle">
            La piattaforma completa per organizzare tornei di calcio professionali. 
            <span className="block mt-2 text-emerald-400 font-bold">
              Gestisci partite, classifiche e statistiche con facilità e stile.
            </span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
            <Button 
              size="lg" 
              className="group text-lg px-10 py-7 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 hover:shadow-emerald-500/60 border-2 border-emerald-400/30 font-black" 
              data-testid="button-get-started"
            >
              <Trophy className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Inizia Ora
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 text-white transition-all hover:scale-105 shadow-xl font-bold"
              data-testid="button-view-demo"
            >
              <Play className="w-6 h-6 mr-3" />
              Guarda Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl animate-in fade-in slide-in-from-bottom-20 duration-700 delay-500">
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="text-5xl font-black bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">100+</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tornei Gestiti</div>
            </div>
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border-x-2 border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="text-5xl font-black bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wider">Squadre Attive</div>
            </div>
            <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/20">
              <div className="text-5xl font-black bg-gradient-to-br from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-teal-500/15 to-emerald-500/15 rounded-full blur-3xl animate-pulse delay-700"></div>
    </section>
  );
}
