import { useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Moon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { HeroScene } from '@/components/three/HeroScene';
import { tonightVisibility } from '@/data/mockData';

const qualityColors: Record<string, string> = {
  Excellent: 'text-emerald-600 bg-emerald-50',
  Good: 'text-blue-600 bg-blue-50',
  Fair: 'text-amber-600 bg-amber-50',
  Poor: 'text-red-500 bg-red-50',
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
    <div>
      {/* Hero Section */}
      <section className="relative astro-gradient overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[420px] py-12 lg:py-0">
            {/* Hero Text */}
            <div className="relative z-10 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                Explore the{' '}
                <span className="astro-text-gradient">universe.</span>
              </h1>
              <p className="mt-4 text-lg text-blue-100/80 max-w-md leading-relaxed">
                Point your telescope at the sky and let AstroLens help you understand what you're seeing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  variant="astro"
                  size="lg"
                  onClick={() => navigate('/identify')}
                  className="group"
                >
                  Identify an Object
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/night-sky')}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                >
                  What's Visible Tonight?
                </Button>
              </div>
            </div>

            {/* 3D Scene */}
            <div className="hidden lg:block h-[380px] animate-fade-in">
              <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
                <HeroScene />
              </WebGLErrorBoundary>
            </div>
          </div>
        </div>

        {/* Decorative bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 40 720 40C360 40 0 0 0 0L0 60Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <div className="page-container -mt-2 space-y-8">
        {/* Current Observation + Next Target */}
        <div className="grid md:grid-cols-2 gap-5 animate-slide-up stagger-1">
          {/* Current Observation */}
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Eye className="w-4 h-4" />
                <span className="font-medium">Current Observation</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Jupiter</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Planet</p>
                </div>
                <span className="text-3xl">🪐</span>
              </div>
              <div className="mt-4">
                <ConfidenceBar value={94} />
              </div>
              <Button
                className="mt-4 w-full"
                variant="outline"
                onClick={() => navigate('/object/jupiter')}
              >
                Explore Jupiter
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Next Target */}
          <Card className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Star className="w-4 h-4" />
                <span className="font-medium">Your Next Observation</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Saturn</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Visible now
                    </span>
                    <span className="text-xs text-muted-foreground">Easy to observe</span>
                  </div>
                </div>
                <span className="text-3xl">🪐</span>
              </div>
              <Button
                className="mt-6 w-full"
                variant="astro"
                onClick={() => navigate('/guide')}
              >
                Guide Me
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Tonight's Sky */}
        <section className="animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Tonight's Sky</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/night-sky')}>
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {tonightVisibility.slice(0, 5).map((vis) => (
              <Card
                key={vis.objectId}
                className="cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => navigate(`/object/${vis.objectId}`)}
              >
                <CardContent className="p-4 text-center">
                  <span className="text-2xl">{typeIcons[vis.objectType] || '✨'}</span>
                  <h3 className="text-sm font-semibold mt-2">{vis.objectName}</h3>
                  <span className={`inline-block text-[11px] font-medium mt-1 px-2 py-0.5 rounded-full ${qualityColors[vis.quality]}`}>
                    {vis.quality}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {vis.bestViewingStart} – {vis.bestViewingEnd}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
