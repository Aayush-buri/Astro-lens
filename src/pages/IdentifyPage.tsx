import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Camera,
  X,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Search,
  CheckCircle2,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { LoadingState } from '@/components/LoadingState';
import { saveCurrentObservation } from '@/lib/astronomy';
import type { CurrentObservationState } from '@/types';

type IdentifyStep = 'upload' | 'analyzing' | 'result';

export function IdentifyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<IdentifyStep>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Derive detected object based on filename or default to Jupiter
  const detectedObject = useMemo(() => {
    if (!selectedFile) {
      return { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant Planet', confidence: 94, emoji: '🪐' };
    }
    const lower = selectedFile.toLowerCase();
    if (lower.includes('mars')) {
      return { id: 'mars', name: 'Mars', type: 'Terrestrial Planet', confidence: 92, emoji: '🔴' };
    }
    if (lower.includes('saturn')) {
      return { id: 'saturn', name: 'Saturn', type: 'Ringed Gas Giant', confidence: 96, emoji: '🪐' };
    }
    if (lower.includes('moon')) {
      return { id: 'moon', name: 'Moon', type: 'Natural Satellite', confidence: 98, emoji: '🌙' };
    }
    if (lower.includes('sirius')) {
      return { id: 'sirius', name: 'Sirius', type: 'Binary Star System', confidence: 95, emoji: '⭐' };
    }
    if (lower.includes('andromeda')) {
      return { id: 'andromeda', name: 'Andromeda Galaxy', type: 'Spiral Galaxy', confidence: 89, emoji: '🌌' };
    }
    return { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant Planet', confidence: 94, emoji: '🪐' };
  }, [selectedFile]);

  const handleFileSelect = useCallback((fileName?: string) => {
    setSelectedFile(typeof fileName === 'string' ? fileName : 'telescope_observation_001.jpg');
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0].name);
    } else {
      setSelectedFile('telescope_observation_001.jpg');
    }
  }, []);

  const handleIdentify = useCallback(() => {
    setStep('analyzing');
    // Allow the 3 scanner checklist steps to complete naturally
    setTimeout(() => {
      const observation: CurrentObservationState = {
        objectId: detectedObject.id,
        objectName: detectedObject.name,
        confidence: detectedObject.confidence,
        imagePreview: selectedFile,
      };
      saveCurrentObservation(observation);
      setStep('result');
    }, 2600);
  }, [detectedObject, selectedFile]);

  const handleGuideMe = useCallback(() => {
    const observation: CurrentObservationState = {
      objectId: detectedObject.id,
      objectName: detectedObject.name,
      confidence: detectedObject.confidence,
      imagePreview: selectedFile,
    };
    saveCurrentObservation(observation);
    navigate('/guide', { state: { currentObservation: observation } });
  }, [detectedObject, selectedFile, navigate]);

  const handleReset = useCallback(() => {
    setStep('upload');
    setSelectedFile(null);
  }, []);

  return (
    <div className="page-container max-w-4xl space-y-8">
      {/* ─── Header ─── */}
      <div className="animate-slide-up text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/60 text-cyan-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          <span>AI Visual Astrometry</span>
        </div>
        <h1 className="section-heading text-3xl sm:text-4xl">What are you looking at?</h1>
        <p className="section-subtitle">
          Upload or capture an image through your telescope eyepiece to identify the celestial object.
        </p>
      </div>

      {/* ─── STEP 1: UPLOAD ─── */}
      {step === 'upload' && (
        <div className="max-w-2xl mx-auto space-y-5 animate-slide-up stagger-1">
          {/* Main Dropzone Card */}
          <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 sm:p-8">
              <div
                role="button"
                tabIndex={0}
                aria-label="Drop zone for telescope images"
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none group ${
                  dragActive
                    ? 'border-cyan-500 bg-cyan-50/50 scale-[0.99]'
                    : 'border-border hover:border-cyan-500/60 hover:bg-accent/40'
                }`}
                onClick={() => handleFileSelect()}
                onKeyDown={(e) => e.key === 'Enter' && handleFileSelect()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {/* Upload Icon with Pulse Glow */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Drop your telescope photo here
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or <span className="text-cyan-600 font-semibold underline underline-offset-2">browse files</span> from your device
                </p>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground/75">
                  <span className="px-2 py-0.5 rounded bg-muted/60">JPG</span>
                  <span className="px-2 py-0.5 rounded bg-muted/60">PNG</span>
                  <span className="px-2 py-0.5 rounded bg-muted/60">TIFF</span>
                  <span>• Max 20MB</span>
                </div>
              </div>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border/80" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  or use camera
                </span>
                <div className="flex-1 h-px bg-border/80" />
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-sm font-semibold hover:border-cyan-500/40 hover:bg-cyan-50/30"
                onClick={() => handleFileSelect()}
              >
                <Camera className="w-4 h-4 text-cyan-600" />
                <span>Capture Direct from Eyepiece Camera</span>
              </Button>
            </CardContent>
          </Card>

          {/* Selected File Stage Preview */}
          {selectedFile && (
            <Card className="border-cyan-500/30 bg-gradient-to-br from-white via-cyan-50/15 to-blue-50/15 animate-fade-in shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-astro-navy flex items-center justify-center shadow-sm">
                      <Sparkles className="w-6 h-6 text-astro-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{selectedFile}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        2.4 MB · High Dynamic Range Telescope Capture
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    aria-label="Remove selected file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  className="w-full mt-4 h-11 text-sm font-semibold shadow-md shadow-cyan-500/25"
                  variant="astro"
                  onClick={handleIdentify}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Identify Celestial Object</span>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ─── STEP 2: ANALYZING (ASTRONOMY SCANNER) ─── */}
      {step === 'analyzing' && (
        <div className="max-w-md mx-auto py-6">
          <Card className="border-border/80 shadow-md">
            <CardContent className="p-8">
              <LoadingState
                message="Analyzing Telescope Observation..."
                steps={[
                  'Processing optical frame',
                  'Cross-referencing star catalog',
                  'Matching celestial object signature',
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── STEP 3: RESULT ─── */}
      {step === 'result' && (
        <div className="max-w-2xl mx-auto animate-fade-in-scale">
          <Card className="overflow-hidden border-cyan-500/30 shadow-xl">
            {/* Celestial Result Banner */}
            <div className="astro-gradient p-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <div className="relative z-10">
                <span className="text-6xl mb-3 block animate-float">{detectedObject.emoji}</span>
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  {detectedObject.type}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {detectedObject.name}
                </h2>
                <p className="text-blue-100/80 text-sm mt-1 max-w-sm mx-auto">
                  Celestial object signature identified from eyepiece capture
                </p>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Confidence Meter */}
              <div className="p-4 rounded-xl bg-accent/40 border border-border/60">
                <ConfidenceBar value={detectedObject.confidence} label="Identification Confidence" />
              </div>

              {/* Observation Summary */}
              <div className="rounded-xl p-4 bg-cyan-50/50 border border-cyan-100 text-sm leading-relaxed text-foreground space-y-2">
                <p className="font-semibold text-cyan-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  Positive Visual Match:
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  You've captured <strong>{detectedObject.name}</strong>. Your telescope observation matches the spectral signature, limb profile, and astrometric position.
                </p>
              </div>

              {/* Action Buttons with Guide Me */}
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                <Button
                  variant="astro"
                  onClick={handleGuideMe}
                  className="w-full text-xs sm:text-sm shadow-md shadow-cyan-500/25"
                >
                  <Compass className="w-4 h-4 mr-1.5" />
                  <span>Guide Me</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/object/${detectedObject.id}`)}
                  className="w-full text-xs sm:text-sm"
                >
                  <span>Learn About {detectedObject.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/assistant')}
                  className="w-full text-xs sm:text-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                  <span>Ask AstroLens</span>
                </Button>
              </div>

              {/* Reset Action */}
              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Identify another celestial object</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
