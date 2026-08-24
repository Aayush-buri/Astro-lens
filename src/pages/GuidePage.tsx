import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { LoadingState } from '@/components/LoadingState';
import { WebGLErrorBoundary, SceneFallback } from '@/components/three/WebGLErrorBoundary';
import { GuidanceScene } from '@/components/three/GuidanceScene';
import { mockGuidance } from '@/data/mockData';

type GuideStep = 'guide' | 'moved' | 'verifying' | 'verified';

export function GuidePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<GuideStep>('guide');
  const g = mockGuidance;

  const handleMoved = useCallback(() => setStep('moved'), []);

  const handleVerify = useCallback(() => {
    setStep('verifying');
    setTimeout(() => setStep('verified'), 2500);
  }, []);

  const HorizontalArrow = g.horizontalDirection === 'RIGHT' ? ArrowRightIcon : ArrowLeftIcon;
  const VerticalArrow = g.verticalDirection === 'UP' ? ArrowUp : ArrowDown;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6 animate-slide-up">
        <h1 className="section-heading">Find {g.targetObject}</h1>
        <p className="section-subtitle">Follow the directions to move your telescope.</p>
      </div>

      {(step === 'guide' || step === 'moved') && (
        <div className="max-w-3xl mx-auto space-y-5 animate-slide-up stagger-1">
          {/* Current → Target */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground font-medium mb-1">Current Object</p>
                <h3 className="text-lg font-bold">{g.currentObject}</h3>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Azimuth {g.current.azimuth}°</p>
                  <p>Altitude {g.current.altitude}°</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs text-primary font-medium mb-1">Target</p>
                <h3 className="text-lg font-bold">{g.targetObject}</h3>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <p>Azimuth {g.target.azimuth}°</p>
                  <p>Altitude {g.target.altitude}°</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3D Guidance Visualization */}
          <Card className="overflow-hidden">
            <div className="astro-gradient h-[280px]">
              <WebGLErrorBoundary fallback={<SceneFallback className="h-full" />}>
                <GuidanceScene
                  deltaAzimuth={g.deltaAzimuth}
                  deltaAltitude={g.deltaAltitude}
                  horizontalDirection={g.horizontalDirection}
                  verticalDirection={g.verticalDirection}
                />
              </WebGLErrorBoundary>
            </div>
          </Card>

          {/* Direction Instructions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-cyan-50/50 border-cyan-200/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <HorizontalArrow className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Horizontal</p>
                  <p className="text-2xl font-bold text-cyan-700">
                    {g.horizontalDirection} {g.deltaAzimuth}°
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50/50 border-blue-200/50">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <VerticalArrow className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vertical</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {g.verticalDirection} {g.deltaAltitude}°
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action buttons */}
          {step === 'guide' && (
            <Button variant="astro" size="lg" className="w-full" onClick={handleMoved}>
              <Compass className="w-5 h-5" />
              I've moved the telescope
            </Button>
          )}

          {step === 'moved' && (
            <Button variant="astro" size="lg" className="w-full" onClick={handleVerify}>
              <Camera className="w-5 h-5" />
              Capture & Verify
            </Button>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-accent/50 rounded-lg">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>Direction guidance is based on the telescope orientation available to AstroLens.</p>
          </div>
        </div>
      )}

      {step === 'verifying' && (
        <div className="max-w-md mx-auto">
          <LoadingState message="Checking new observation..." />
        </div>
      )}

      {step === 'verified' && (
        <div className="max-w-lg mx-auto animate-slide-up">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold">Target acquired</h2>
              <p className="text-muted-foreground mt-1">
                <strong>{g.targetObject}</strong> detected
              </p>
              <div className="mt-4 max-w-xs mx-auto">
                <ConfidenceBar value={91} />
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Button
                  variant="astro"
                  onClick={() => navigate(`/object/${g.targetObject.toLowerCase()}`)}
                >
                  Learn About {g.targetObject}
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/assistant')}>
                  <MessageCircle className="w-4 h-4" />
                  Ask AstroLens
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
