import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { HeroScene } from '@/components/three/HeroScene';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <section className="relative astro-gradient overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Subtle Ambient Space Background Glows */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* ─── Main Hero Content ─── */}
      <div className="flex-1 flex items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* ─── LEFT: Text Content ─── */}
          <div className="relative z-10 space-y-6 lg:space-y-7">
            {/* Badge */}
            <div className="hero-header inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-medium backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Telescope Assistant</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Explore the{' '}
              <span className="astro-text-gradient">universe.</span>
            </h1>

            {/* Supporting Text */}
            <p className="hero-text text-base sm:text-lg text-blue-100/85 max-w-lg leading-relaxed">
              Point your telescope at the sky and let AstroLens help you
              identify, explore, and understand what you're seeing.
            </p>

            {/* Action Buttons */}
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

          {/* ─── RIGHT: 3D Scene Viewport ─── */}
          <div className="hero-scene relative h-[320px] sm:h-[400px] lg:h-[520px] w-full">
            <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
              <HeroScene />
            </WebGLErrorBoundary>
          </div>
        </div>
      </div>

      {/* ─── Bottom Status Indicator ─── */}
      <div className="hero-header relative z-10 pb-6 lg:pb-8 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse" />
          <span className="text-xs font-medium text-blue-200/70 tracking-wide">
            Observation Ready
          </span>
        </div>
      </div>
    </section>
  );
}
