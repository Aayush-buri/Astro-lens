import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Moon, Star, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { HeroScene } from '@/components/three/HeroScene';
import { tonightVisibility } from '@/data/mockData';

const qualityColors: Record<string, string> = {
  Excellent: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
  Good: 'text-blue-700 bg-blue-50 border-blue-200/60',
  Fair: 'text-amber-700 bg-amber-50 border-amber-200/60',
  Poor: 'text-red-600 bg-red-50 border-red-200/60',
};

const typeIcons: Record<string, string> = {
  Moon: '🌙',
  Planet: '🪐',
  Star: '⭐',
  Galaxy: '🌌',
};

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* ─── Hero Section with Sequenced Entrance ─── */}
      <section className="relative astro-gradient overflow-hidden pb-12 pt-8 lg:py-16">
        {/* Subtle Ambient Space Background Glows */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[420px]">
            {/* Hero Text Content */}
            <div className="relative z-10 space-y-6">
              {/* Badge (Sequence 1) */}
              <div className="hero-header inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-medium backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Telescope Assistant</span>
              </div>

              {/* Main Heading (Sequence 2) */}
              <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Explore the{' '}
                <span className="astro-text-gradient">universe.</span>
              </h1>

              {/* Supporting Text (Sequence 3) */}
              <p className="hero-text text-base sm:text-lg text-blue-100/85 max-w-lg leading-relaxed">
                Point your telescope at the sky and let AstroLens help you identify, track, and understand what you're seeing in real time.
              </p>

              {/* Action Buttons (Sequence 4) */}
              <div className="hero-buttons flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="astro"
                  size="lg"
                  onClick={() => navigate('/identify')}
                  className="group shadow-lg shadow-cyan-500/20"
                >
                  <span>Identify an Object</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/night-sky')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                >
                  <Moon className="w-4 h-4 mr-1 text-cyan-300" />
                  <span>What's Visible Tonight?</span>
                </Button>
              </div>
            </div>

            {/* 3D Scene Viewport (Sequence 5) */}
            <div className="hero-scene relative h-[320px] sm:h-[380px] lg:h-[420px] w-full">
              <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
                <HeroScene />
              </WebGLErrorBoundary>
            </div>
          </div>
        </div>

        {/* Decorative Bottom Curved Divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 48" fill="none" className="w-full h-8 sm:h-12 object-cover">
            <path
              d="M0 48L1440 48L1440 0C1440 0 1080 32 720 32C360 32 0 0 0 0L0 48Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* ─── Dashboard Cards Section ─── */}
      <div className="page-container -mt-4 sm:-mt-6 space-y-8">
        {/* Current Observation & Next Target Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Current Observation Card */}
          <ScrollReveal delay={50}>
            <Card className="h-full overflow-hidden border-border/80 hover:border-cyan-500/40 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-md">
                      <Eye className="w-3.5 h-3.5" />
                      <span>CURRENT OBSERVATION</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Live Telemetry</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Jupiter
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                        Gas Giant Planet · Solar System
                      </p>
                    </div>
                    {/* Glowing Planet Visual */}
                    <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/10 to-cyan-500/10 border border-border/60 shadow-sm group-hover:scale-105 transition-transform">
                      <span className="text-3xl">🪐</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <ConfidenceBar value={94} label="Match Confidence" />
                  </div>
                </div>

                <Button
                  className="mt-6 w-full group/btn"
                  variant="outline"
                  onClick={() => navigate('/object/jupiter')}
                >
                  <span>Explore Jupiter Details</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Next Target Card with Orbital Illustration */}
          <ScrollReveal delay={120}>
            <Card className="h-full overflow-hidden border-cyan-500/30 bg-gradient-to-br from-white via-cyan-50/20 to-blue-50/20 hover:border-cyan-500/50 hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      <Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                      <span>YOUR NEXT OBSERVATION</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      Visible Now
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Saturn
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          Rings in optimal viewing angle
                        </span>
                        <span className="text-xs text-cyan-600 font-medium">· Easy</span>
                      </div>
                    </div>

                    {/* Animated Orbital Indicator */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <svg className="absolute inset-0 w-full h-full orbital-line text-cyan-500/40" viewBox="0 0 56 56" fill="none">
                        <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                      </svg>
                      <span className="text-3xl relative z-10">🪐</span>
                    </div>
                  </div>

                  {/* Alignment Delta Indicator */}
                  <div className="mt-5 p-3 rounded-lg bg-white/80 border border-cyan-100 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Compass className="w-3.5 h-3.5 text-cyan-600" />
                      Delta from current:
                    </span>
                    <span className="font-semibold text-cyan-700">RIGHT 18° · UP 4°</span>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full group/btn"
                  variant="astro"
                  onClick={() => navigate('/guide')}
                >
                  <span>Guide Telescope to Target</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>

        {/* ─── Tonight's Sky Section with ScrollReveal ─── */}
        <ScrollReveal delay={180}>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Moon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Tonight's Sky Highlights
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Best objects visible from your location tonight
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/night-sky')}
                className="group"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>

            {/* 5 Prominent Celestial Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {tonightVisibility.slice(0, 5).map((vis, idx) => (
                <div
                  key={vis.objectId}
                  onClick={() => navigate(`/object/${vis.objectId}`)}
                  className="cursor-pointer group"
                >
                  <Card className="h-full border-border/80 hover:border-cyan-500/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                    <CardContent className="p-4 text-center flex flex-col justify-between h-full">
                      <div>
                        {/* Object Icon with subtle hover zoom */}
                        <div className="w-12 h-12 mx-auto rounded-xl bg-accent/60 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                          <span className="text-2xl">{typeIcons[vis.objectType] || '✨'}</span>
                        </div>

                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {vis.objectName}
                        </h3>
                        <p className="text-[11px] text-muted-foreground capitalize">
                          {vis.objectType}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1.5">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${qualityColors[vis.quality]}`}
                        >
                          {vis.quality}
                        </span>
                        <p className="text-[10px] text-muted-foreground font-medium truncate">
                          {vis.bestViewingStart} – {vis.bestViewingEnd}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
