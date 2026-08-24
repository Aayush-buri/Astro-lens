import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Compass,
  MessageCircle,
  Clock,
  Lightbulb,
  Info,
  List,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { EmptyState } from '@/components/EmptyState';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { PlanetScene } from '@/components/three/PlanetScene';
import { celestialObjects } from '@/data/mockData';

export function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const obj = celestialObjects.find((o) => o.id === id);

  if (!obj) {
    return (
      <div className="page-container py-12">
        <EmptyState
          title="Celestial object not found"
          message="We couldn't find this object in the current sky database. Try choosing another target."
          action={{ label: 'Back to Dashboard', onClick: () => navigate('/') }}
        />
      </div>
    );
  }

  const hasRings = obj.id === 'saturn';
  const showPlanetScene = true;

  return (
    <div className="space-y-6">
      {/* ─── Hero Header & 3D Celestial Viewport ─── */}
      <div className="astro-gradient relative overflow-hidden pb-12 pt-6 lg:py-12">
        {/* Subtle Background Glows */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-medium mb-6 transition-all duration-200 group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to previous page</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Object Title & Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  {obj.type}
                </span>
                <span className="text-xs text-blue-200 font-medium">
                  Difficulty: {obj.difficulty}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                {obj.name}
              </h1>

              {/* Confidence Meter */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm max-w-sm">
                <ConfidenceBar value={94} label="Telescope Observation Match" />
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  variant="astro"
                  onClick={() => navigate('/target')}
                  className="shadow-md shadow-cyan-500/20"
                >
                  <Compass className="w-4 h-4 mr-1.5" />
                  <span>Target with Telescope</span>
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  onClick={() => navigate('/assistant')}
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-cyan-300" />
                  <span>Ask AstroLens About {obj.name}</span>
                </Button>
              </div>
            </div>

            {/* 3D Celestial Object Viewport */}
            {showPlanetScene && (
              <div className="h-[280px] sm:h-[340px] w-full relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs overflow-hidden">
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

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 36" fill="none" className="w-full h-6 sm:h-9 object-cover">
            <path
              d="M0 36L1440 36L1440 0C1440 0 1080 24 720 24C360 24 0 0 0 0L0 36Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </div>

      {/* ─── Detailed Information Content ─── */}
      <div className="page-container -mt-4 space-y-6">
        {/* Description / What You're Seeing */}
        <ScrollReveal delay={50}>
          <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <span>What you're seeing through the eyepiece</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {obj.description}
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Quick Facts Grid */}
        <ScrollReveal delay={120}>
          <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center gap-2.5 text-base font-bold">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 flex items-center justify-center">
                  <List className="w-4 h-4 text-cyan-600" />
                </div>
                <span>Quick Facts & Astrometric Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {obj.quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="p-3 rounded-lg bg-accent/30 hover:bg-accent/60 border border-border/40 transition-colors flex flex-col justify-between"
                  >
                    <span className="text-xs text-muted-foreground font-medium">{fact.label}</span>
                    <span className="text-sm font-bold text-foreground mt-1">{fact.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Best Time to Observe + Fun Fact */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Best Time Card */}
          <ScrollReveal delay={180}>
            <Card className="h-full border-blue-200/50 bg-gradient-to-br from-white to-blue-50/20 shadow-sm">
              <CardHeader className="pb-3 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold text-blue-900">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Best Time to Observe</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {obj.bestTime}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Fun Fact Card */}
          <ScrollReveal delay={240}>
            <Card className="h-full border-amber-200/50 bg-gradient-to-br from-white to-amber-50/20 shadow-sm">
              <CardHeader className="pb-3 border-b border-amber-100">
                <CardTitle className="flex items-center gap-2.5 text-base font-bold text-amber-900">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                  <span>Astronomy Fun Fact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {obj.funFact}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
