import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, MessageCircle, Clock, Lightbulb, Info, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { EmptyState } from '@/components/EmptyState';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { PlanetScene } from '@/components/three/PlanetScene';
import { celestialObjects } from '@/data/mockData';

export function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const obj = celestialObjects.find((o) => o.id === id);

  if (!obj) {
    return (
      <div className="page-container">
        <EmptyState
          title="Object not found"
          message="We couldn't find this celestial object. Try searching for another one."
          action={{ label: 'Go to Dashboard', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const hasRings = obj.id === 'saturn';
  const showPlanetScene = obj.type === 'planet' || obj.type === 'moon';

  return (
    <div>
      {/* Hero Header */}
      <div className="astro-gradient relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-cyan-400 text-sm font-medium mb-1 uppercase tracking-wider">
                {obj.type}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white">{obj.name}</h1>
              <div className="mt-4 max-w-sm">
                <ConfidenceBar value={94} label="Identification Confidence" />
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <Button variant="astro" onClick={() => navigate('/target')}>
                  <Compass className="w-4 h-4" />
                  Find Target
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
                  onClick={() => navigate('/assistant')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask AstroLens
                </Button>
              </div>
            </div>

            {showPlanetScene && (
              <div className="hidden lg:block h-[280px]">
                <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
                  <PlanetScene
                    color={obj.color}
                    name={obj.name}
                    hasRings={hasRings}
                  />
                </WebGLErrorBoundary>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" className="w-full">
            <path d="M0 40L1440 40L1440 0C1440 0 1080 30 720 30C360 30 0 0 0 0L0 40Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="page-container -mt-2 space-y-5">
        {/* What you're seeing */}
        <Card className="animate-slide-up">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4 text-primary" />
              What you're seeing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {obj.description}
            </p>
          </CardContent>
        </Card>

        {/* Quick Facts */}
        <Card className="animate-slide-up stagger-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <List className="w-4 h-4 text-primary" />
              Quick Facts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {obj.quickFacts.map((fact) => (
                <div key={fact.label} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">{fact.label}</span>
                  <span className="text-sm font-medium">{fact.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Time + Fun Fact */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Card className="animate-slide-up stagger-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-primary" />
                Best time to observe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {obj.bestTime}
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up stagger-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Fun fact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {obj.funFact}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
