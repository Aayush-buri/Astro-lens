import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, X, ArrowRight, Sparkles, MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { LoadingState } from '@/components/LoadingState';

type IdentifyStep = 'upload' | 'analyzing' | 'result';

export function IdentifyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<IdentifyStep>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback(() => {
    setSelectedFile('telescope_observation_001.jpg');
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
    setSelectedFile('telescope_observation_001.jpg');
  }, []);

  const handleIdentify = useCallback(() => {
    setStep('analyzing');
    setTimeout(() => setStep('result'), 2500);
  }, []);

  const handleReset = useCallback(() => {
    setStep('upload');
    setSelectedFile(null);
  }, []);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="section-heading">What are you looking at?</h1>
        <p className="section-subtitle">
          Upload a telescope image to identify the celestial object.
        </p>
      </div>

      {step === 'upload' && (
        <div className="max-w-2xl mx-auto animate-slide-up stagger-1">
          {/* Upload Zone */}
          <Card>
            <CardContent className="p-6">
              <div
                role="button"
                tabIndex={0}
                aria-label="Drop zone for telescope images"
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/30'
                }`}
                onClick={handleFileSelect}
                onKeyDown={(e) => e.key === 'Enter' && handleFileSelect()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <p className="text-base font-medium">
                  Drop your telescope image here
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  Supports JPG, PNG, TIFF • Max 20MB
                </p>
              </div>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={handleFileSelect}
              >
                <Camera className="w-4 h-4" />
                Capture with Camera
              </Button>
            </CardContent>
          </Card>

          {/* Selected File Preview */}
          {selectedFile && (
            <Card className="mt-4 animate-slide-up">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-astro-navy flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-astro-cyan" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedFile}</p>
                      <p className="text-xs text-muted-foreground">2.4 MB • Ready to analyze</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 hover:bg-accent rounded-lg transition-colors"
                    aria-label="Remove selected file"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="astro"
                  onClick={handleIdentify}
                >
                  <Sparkles className="w-4 h-4" />
                  Identify Object
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === 'analyzing' && (
        <div className="max-w-md mx-auto">
          <LoadingState message="Looking at your observation..." />
        </div>
      )}

      {step === 'result' && (
        <div className="max-w-2xl mx-auto animate-slide-up">
          <Card className="overflow-hidden">
            {/* Result Header */}
            <div className="astro-gradient p-6 text-center">
              <span className="text-5xl mb-3 block">🪐</span>
              <h2 className="text-3xl font-bold text-white">Jupiter</h2>
              <p className="text-blue-200 mt-1">Planet</p>
            </div>
            <CardContent className="p-6 space-y-5">
              <ConfidenceBar value={94} label="Identification Confidence" />

              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  You've captured <strong>Jupiter</strong>, the largest planet in our solar system.
                  The image shows its distinctive cloud bands and possibly some of its largest moons.
                  Jupiter is a gas giant with no solid surface, and its Great Red Spot is a
                  storm bigger than Earth!
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <Button
                  variant="astro"
                  onClick={() => navigate('/object/jupiter')}
                  className="w-full"
                >
                  Learn About Jupiter
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/target')}
                  className="w-full"
                >
                  <Search className="w-4 h-4" />
                  Find Another Target
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/assistant')}
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4" />
                  Ask AstroLens
                </Button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Identify another object
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
