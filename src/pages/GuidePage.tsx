import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  CheckCircle2,
  Camera,
  Compass,
  MessageCircle,
  Info,
  Search,
  Check,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { GuidanceScene } from '@/components/three/GuidanceScene';
import {
  getSavedCurrentObservation,
  getCoordinates,
  calculateGuidance,
  getTargetVisibilityInfo,
} from '@/lib/astronomy';
import { suggestedTargets } from '@/data/mockData';
import type { CurrentObservationState } from '@/types';

type GuideStep = 'select' | 'checking' | 'guide' | 'moved' | 'verifying' | 'verified' | 'unconfirmed';

const typeEmojis: Record<string, string> = {
  jupiter: '🪐',
  saturn: '🪐',
  moon: '🌙',
  mars: '🔴',
  sirius: '⭐',
  andromeda: '🌌',
};

export function GuidePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve current observation from route navigation state or session storage
  const currentObservation = useMemo<CurrentObservationState | null>(() => {
    const fromState = location.state?.currentObservation as CurrentObservationState | undefined;
    if (fromState && fromState.objectName) return fromState;
    return getSavedCurrentObservation();
  }, [location.state]);

  // Target selection & Step State
  const [selectedTarget, setSelectedTarget] = useState<string>('Saturn');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [step, setStep] = useState<GuideStep>('guide');

  // If the current object happens to be the default target (e.g. Saturn), switch default to another object
  useEffect(() => {
    if (currentObservation) {
      if (currentObservation.objectName.toLowerCase() === selectedTarget.toLowerCase()) {
        setSelectedTarget(currentObservation.objectName.toLowerCase() === 'saturn' ? 'Jupiter' : 'Saturn');
      }
    }
  }, [currentObservation]);

  // Current telescope coordinates
  const currentCoords = useMemo(() => {
    if (!currentObservation) return { azimuth: 120, altitude: 40 };
    return getCoordinates(currentObservation.objectName);
  }, [currentObservation]);

  // Target visibility information
  const targetVisibility = useMemo(() => {
    return getTargetVisibilityInfo(selectedTarget);
  }, [selectedTarget]);

  // Calculated guidance delta from current to target
  const guidance = useMemo(() => {
    if (!currentObservation) {
      return calculateGuidance('Jupiter', selectedTarget);
    }
    return calculateGuidance(currentObservation.objectName, selectedTarget);
  }, [currentObservation, selectedTarget]);

  // Angular separation calculation
  const angularSeparation = useMemo(() => {
    const az = guidance.deltaAzimuth;
    const alt = guidance.deltaAltitude;
    return Math.sqrt(az * az + alt * alt).toFixed(1);
  }, [guidance]);

  // Filter suggested targets (excluding currently observed object)
  const filteredSuggestions = useMemo(() => {
    const curName = currentObservation?.objectName.toLowerCase() || '';
    return suggestedTargets.filter((t) => {
      const matchesSearch = !searchQuery.trim() || t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const isNotCurrent = t.name.toLowerCase() !== curName;
      return matchesSearch && isNotCurrent;
    });
  }, [currentObservation, searchQuery]);

  // Target selection handler
  const handleSelectTarget = useCallback((targetName: string) => {
    setSelectedTarget(targetName);
    setStep('checking');
    setTimeout(() => {
      setStep('guide');
    }, 700);
  }, []);

  const handleMoved = useCallback(() => setStep('moved'), []);

  const handleVerify = useCallback(() => {
    setStep('verifying');
    setTimeout(() => setStep('verified'), 2200);
  }, []);

  const handleRetry = useCallback(() => {
    setStep('guide');
  }, []);

  // Empty state if no observation has been made yet
  if (!currentObservation) {
    return (
      <div className="page-container py-12">
        <EmptyState
          title="No Telescope Observation Found"
          message="Start by identifying what your telescope is currently viewing so AstroLens can calculate guidance to your next target."
          action={{
            label: 'Identify an Object',
            onClick: () => navigate('/identify'),
          }}
        />
      </div>
    );
  }

  const currentEmoji = typeEmojis[currentObservation.objectId?.toLowerCase()] || '🪐';
  const targetKey = selectedTarget.toLowerCase().replace(/\s+galaxy$/i, '');
  const targetEmoji = typeEmojis[targetKey] || '✨';

  const HorizontalArrow = guidance.horizontalDirection === 'RIGHT' ? ArrowRightIcon : ArrowLeftIcon;
  const VerticalArrow = guidance.verticalDirection === 'UP' ? ArrowUp : ArrowDown;

  return (
    <div className="page-container max-w-6xl space-y-6 sm:space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up pb-2 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 text-cyan-700 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            <span>CURRENT POSITION: {currentObservation.objectName.toUpperCase()}</span>
          </div>
          <h1 className="section-heading text-2xl sm:text-3xl lg:text-4xl">Find Your Next Object</h1>
          <p className="section-subtitle text-sm sm:text-base">
            Your telescope is currently pointed at <strong className="text-foreground">{currentObservation.objectName}</strong>.
          </p>
        </div>

        {/* Change Current Observation CTA */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/identify')}
          className="self-start sm:self-auto text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <span>Re-identify Position</span>
        </Button>
      </div>

      {/* ─── 3-Step Navigation Pipeline ─── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center select-none text-xs sm:text-sm font-semibold">
        <div
          className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
            step === 'select' || step === 'checking'
              ? 'bg-primary/10 border-primary text-primary shadow-xs'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current/15 flex items-center justify-center text-xs">
            {step !== 'select' && step !== 'checking' ? '✓' : '1'}
          </span>
          <span className="hidden sm:inline">1. Target Selection</span>
          <span className="sm:hidden">Target</span>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
            step === 'guide' || step === 'moved'
              ? 'bg-primary/10 border-primary text-primary shadow-xs'
              : step === 'verifying' || step === 'verified'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-accent/40 border-border/60 text-muted-foreground'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current/15 flex items-center justify-center text-xs">
            {step === 'verifying' || step === 'verified' ? '✓' : '2'}
          </span>
          <span className="hidden sm:inline">2. Move Telescope</span>
          <span className="sm:hidden">Move</span>
        </div>

        <div
          className={`p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${
            step === 'verifying'
              ? 'bg-primary/10 border-primary text-primary animate-pulse'
              : step === 'verified'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-accent/40 border-border/60 text-muted-foreground'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-current/15 flex items-center justify-center text-xs">
            {step === 'verified' ? '✓' : '3'}
          </span>
          <span className="hidden sm:inline">3. Verify Target</span>
          <span className="sm:hidden">Verify</span>
        </div>
      </div>

      {/* ─── MAIN GUIDE VIEW (Guidance & Target Selection) ─── */}
      {(step === 'select' || step === 'checking' || step === 'guide' || step === 'moved') && (
        <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">
          {/* ─── LEFT COLUMN: Current Observation & Target Selector ─── */}
          <div className="lg:col-span-5 space-y-5">
            {/* Current Position Card */}
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md">
                    <Compass className="w-3.5 h-3.5 text-cyan-600" />
                    <span>CURRENTLY OBSERVING</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Position established
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center text-2xl shadow-xs">
                      {currentEmoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {currentObservation.objectName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Match Confidence: {currentObservation.confidence}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Current Coordinates:</span>
                  <span className="font-mono font-medium text-foreground">
                    Az {currentCoords.azimuth}° · Alt {currentCoords.altitude}°
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Target Selector Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>What do you want to see next?</span>
                  <span className="text-xs font-normal text-muted-foreground">Select target</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search celestial object..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 pl-9 pr-8 text-xs sm:text-sm rounded-lg"
                    aria-label="Search celestial object"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggested Targets Pills/Cards */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Suggested Targets
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSuggestions.map((t) => {
                      const isSelected = selectedTarget.toLowerCase() === t.name.toLowerCase();
                      const em = typeEmojis[t.id] || '✨';
                      return (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTarget(t.name)}
                          className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-900 font-bold shadow-xs'
                              : 'bg-accent/30 hover:bg-accent border-border/60 text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{em}</span>
                            <span className="truncate">{t.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Visibility Status Banner */}
                {step === 'checking' ? (
                  <div className="p-3.5 rounded-lg bg-accent/40 border border-border/60 text-center animate-pulse">
                    <p className="text-xs text-muted-foreground font-medium">
                      Checking {selectedTarget} visibility...
                    </p>
                  </div>
                ) : targetVisibility.isVisible ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedTarget} · Visible Tonight
                      </span>
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {targetVisibility.quality}
                      </span>
                    </div>
                    <p className="text-emerald-700">
                      Best viewing: {targetVisibility.bestViewingStart} – {targetVisibility.bestViewingEnd}
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 space-y-1 text-xs">
                    <p className="font-bold text-red-800 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                      {selectedTarget} is Below Horizon
                    </p>
                    <p className="text-red-700">
                      Next rise: Tomorrow at 9:20 PM. Please select another target.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ─── RIGHT COLUMN: Primary Telescope Guidance Instrument ─── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Main Instrument Card */}
            <Card className="overflow-hidden border-cyan-500/30 shadow-md">
              {/* Header Summary */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-astro-navy via-astro-deep to-astro-blue text-white flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{currentEmoji}</span>
                    <span>{currentObservation.objectName}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <span className="text-lg">{targetEmoji}</span>
                    <span>{selectedTarget}</span>
                  </div>
                </div>

                <span className="text-xs text-blue-200/80 font-mono">
                  Sep: {angularSeparation}°
                </span>
              </div>

              {/* 3D Guidance Viewport */}
              <div className="h-[250px] sm:h-[300px] w-full bg-slate-950 relative">
                <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
                  <GuidanceScene
                    deltaAzimuth={guidance.deltaAzimuth}
                    deltaAltitude={guidance.deltaAltitude}
                    horizontalDirection={guidance.horizontalDirection}
                    verticalDirection={guidance.verticalDirection}
                  />
                </WebGLErrorBoundary>
              </div>

              {/* Prominent Direction Indicators */}
              <CardContent className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* Horizontal Direction Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-cyan-50/70 border-2 border-cyan-300/80 shadow-xs flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center shrink-0 shadow-xs">
                      <HorizontalArrow className="w-7 h-7 text-cyan-700 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cyan-800 uppercase tracking-wider">
                        Horizontal Turn
                      </p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-cyan-900 tracking-tight">
                        {guidance.horizontalDirection} {guidance.deltaAzimuth}°
                      </p>
                    </div>
                  </div>

                  {/* Vertical Elevation Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border-2 border-blue-300/80 shadow-xs flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                      <VerticalArrow className="w-7 h-7 text-blue-700 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                        Vertical Pitch
                      </p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
                        {guidance.verticalDirection} {guidance.deltaAltitude}°
                      </p>
                    </div>
                  </div>
                </div>

                {/* Beginner-Friendly Clear Instructions */}
                <div className="p-4 rounded-xl bg-accent/40 border border-border/60 text-xs sm:text-sm text-foreground/90 space-y-1">
                  <p className="font-semibold text-foreground">
                    Instructions for telescope operator:
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Rotate the telescope slowly to the <strong>{guidance.horizontalDirection.toLowerCase()} by {guidance.deltaAzimuth}°</strong>, then <strong>{guidance.verticalDirection === 'UP' ? 'raise' : 'lower'} the tube by {guidance.deltaAltitude}°</strong> until the target marker aligns in your crosshairs.
                  </p>
                </div>

                {/* Main Step Actions */}
                {step === 'guide' && (
                  <Button
                    variant="astro"
                    size="lg"
                    className="w-full text-base font-bold shadow-lg shadow-cyan-500/25 h-12"
                    onClick={handleMoved}
                  >
                    <Compass className="w-5 h-5 mr-2" />
                    <span>I've Moved the Telescope</span>
                  </Button>
                )}

                {step === 'moved' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-center text-xs font-medium">
                      Telescope repositioned. Ready to capture and verify eyepiece observation.
                    </div>
                    <Button
                      variant="astro"
                      size="lg"
                      className="w-full text-base font-bold shadow-lg shadow-cyan-500/25 h-12"
                      onClick={handleVerify}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      <span>Capture & Verify Target</span>
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                  <Info className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>Guidance angles are referenced to observer azimuth and local altitude.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ─── STEP: VERIFYING OBSERVATION ─── */}
      {step === 'verifying' && (
        <div className="max-w-md mx-auto py-8 animate-fade-in">
          <Card className="border-border/80 shadow-md">
            <CardContent className="p-8">
              <LoadingState
                message={`Checking new observation for ${selectedTarget}...`}
                steps={[
                  'Capturing optical frame',
                  'Analyzing spectral coordinates',
                  `Confirming ${selectedTarget} signature`,
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── STEP: TARGET ACQUIRED (SUCCESS STATE) ─── */}
      {step === 'verified' && (
        <div className="max-w-xl mx-auto animate-fade-in-scale">
          <Card className="overflow-hidden border-emerald-500/40 shadow-xl">
            {/* Header Success Banner */}
            <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 text-center text-white relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-emerald-200" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
                ALIGNMENT CONFIRMED
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">
                Target Acquired!
              </h2>
              <p className="text-emerald-100/90 text-sm mt-1">
                <strong>{selectedTarget}</strong> is now centered in your telescope field of view.
              </p>
            </div>

            {/* Content & Match Metrics */}
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-xl bg-accent/40 border border-border/60">
                <ConfidenceBar value={91} label={`${selectedTarget} Match Confidence`} />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-sm text-emerald-950 leading-relaxed space-y-1">
                <p className="font-semibold">Observational verification complete:</p>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Target telemetry confirms your telescope has acquired <strong>{selectedTarget}</strong>. You can now explore its astrometric facts or ask questions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="astro"
                  size="lg"
                  onClick={() => navigate(`/object/${targetKey}`)}
                  className="w-full text-sm shadow-md shadow-cyan-500/25"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Learn About {selectedTarget}</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/assistant')}
                  className="w-full text-sm"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5 text-cyan-600" />
                  <span>Ask AstroLens</span>
                </Button>
              </div>

              {/* Reset to Guide Again */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setStep('guide')}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Choose another celestial target</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── STEP: UNCONFIRMED / RETRY STATE ─── */}
      {step === 'unconfirmed' && (
        <div className="max-w-lg mx-auto animate-fade-in">
          <Card className="border-amber-400/50 shadow-lg">
            <CardContent className="p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Target Not Confirmed</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  The captured observation does not appear to match <strong>{selectedTarget}</strong>.
                </p>
              </div>
              <div className="flex gap-3 justify-center pt-2">
                <Button variant="astro" onClick={handleRetry}>
                  <span>Adjust Telescope</span>
                </Button>
                <Button variant="outline" onClick={handleRetry}>
                  <span>Try Again</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
