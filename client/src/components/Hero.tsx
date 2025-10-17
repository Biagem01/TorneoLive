import { Button } from "@/components/ui/button";
import { Trophy, Play } from "lucide-react";
import heroImage from "@assets/generated_images/Football_stadium_celebration_scene_b84a032b.png";

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-end" data-testid="section-hero">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 pb-16 w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6" data-testid="text-hero-title">
            Manage Football Tournaments{" "}
            <span className="text-primary">Live</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
            Track matches, rankings, and top scorers in real-time. Complete tournament management at your fingertips.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" className="text-lg" data-testid="button-get-started">
              <Trophy className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg bg-background/50 backdrop-blur-sm"
              data-testid="button-view-demo"
            >
              <Play className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
