import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Camera,
  X,
  ArrowRight,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  RefreshCw,
  Compass,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { LoadingState } from '@/components/LoadingState';
import { saveCurrentObservation } from '@/lib/astronomy';
import type { CurrentObservationState } from '@/types';

type IdentifyStep = 'upload' | 'analyzing' | 'result';

interface SelectedFileState {
  name: string;
  sizeFormatted: string;
  previewUrl: string;
}

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function IdentifyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<IdentifyStep>('upload');
  const [selectedFile, setSelectedFile] = useState<SelectedFileState | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraNotice, setCameraNotice] = useState<string | null>(null);

  // Clean up object URL when component unmounts or selectedFile changes
  useEffect(() => {
    return () => {
      if (selectedFile?.previewUrl && selectedFile.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(selectedFile.previewUrl);
      }
    };
  }, [selectedFile]);

  // Derive detected object based on filename or default to Jupiter
  const detectedObject = useMemo(() => {
    if (!selectedFile) {
      return { id: 'jupiter', name: 'Jupiter', type: 'Gas Giant Planet', confidence: 94, emoji: '🪐' };
    }
    const lower = selectedFile.name.toLowerCase();
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

  // Validate and process a selected or dropped file
  const processFile = useCallback((file: File) => {
    setErrorMessage(null);
    setCameraNotice(null);

    // Validate file size (max 20 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('Image must be smaller than 20 MB.');
      return;
    }

    // Validate file type
    const lowerName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
    const hasValidMime = ALLOWED_MIME_TYPES.includes(file.type);

    if (!hasValidMime && !hasValidExtension) {
      setErrorMessage('Please upload a JPG, PNG, TIFF, or WEBP image.');
      return;
    }

    // Revoke previous object URL if any
    if (selectedFile?.previewUrl && selectedFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }

    // Create object URL for actual image preview
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile({
      name: file.name,
      sizeFormatted: formatFileSize(file.size),
      previewUrl,
    });
  }, [selectedFile]);

  // Native input change event handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFile(files[0]);
      }
      // Reset input value so re-uploading the same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFile]
  );

  // Click on dropzone or browse files triggers file picker
  const triggerFilePicker = useCallback(() => {
    setErrorMessage(null);
    setCameraNotice(null);
    fileInputRef.current?.click();
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  // Remove file handler
  const handleRemoveFile = useCallback(() => {
    if (selectedFile?.previewUrl && selectedFile.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(selectedFile.previewUrl);
    }
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFile]);

  // Camera integration click handler
  const handleCameraClick = useCallback(() => {
    setErrorMessage(null);
    setCameraNotice('Camera capture will be available when telescope camera integration is connected.');
  }, []);

  // Identify handler
  const handleIdentify = useCallback(() => {
    setStep('analyzing');
    // Allow the 3 scanner checklist steps to complete naturally
    setTimeout(() => {
      const observation: CurrentObservationState = {
        objectId: detectedObject.id,
        objectName: detectedObject.name,
        confidence: detectedObject.confidence,
        imagePreview: selectedFile?.previewUrl || null,
      };
      saveCurrentObservation(observation);
      setStep('result');
    }, 2600);
  }, [detectedObject, selectedFile]);

  // Guide Me action
  const handleGuideMe = useCallback(() => {
    const observation: CurrentObservationState = {
      objectId: detectedObject.id,
      objectName: detectedObject.name,
      confidence: detectedObject.confidence,
      imagePreview: selectedFile?.previewUrl || null,
    };
    saveCurrentObservation(observation);
    navigate('/guide', { state: { currentObservation: observation } });
  }, [detectedObject, selectedFile, navigate]);

  // Ask AstroLens action
  const handleAskAstroLens = useCallback(() => {
    const observation: CurrentObservationState = {
      objectId: detectedObject.id,
      objectName: detectedObject.name,
      confidence: detectedObject.confidence,
      imagePreview: selectedFile?.previewUrl || null,
    };
    saveCurrentObservation(observation);
    navigate('/assistant', { state: { currentObservation: observation } });
  }, [detectedObject, selectedFile, navigate]);

  // Reset to upload another file
  const handleReset = useCallback(() => {
    handleRemoveFile();
    setStep('upload');
  }, [handleRemoveFile]);

  return (
    <div className="page-container max-w-4xl space-y-8">
      {/* Hidden real file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="telescope-photo-input"
        accept="image/jpeg,image/png,image/tiff,image/webp,.jpg,.jpeg,.png,.tiff,.tif,.webp"
        className="sr-only"
        onChange={handleFileInputChange}
        aria-label="Upload telescope image file"
      />

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
          {/* Validation Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-red-800 text-sm flex items-start gap-3 animate-fade-in"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-xs text-red-700 mt-0.5">
                  Supported formats: JPG, JPEG, PNG, TIFF, WEBP (under 20 MB).
                </p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Camera Notice Message */}
          {cameraNotice && (
            <div
              role="status"
              className="p-4 rounded-xl bg-cyan-50 border border-cyan-200/80 text-cyan-900 text-sm flex items-start gap-3 animate-fade-in"
            >
              <Camera className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{cameraNotice}</p>
                <p className="text-xs text-cyan-700 mt-0.5">
                  Please browse or drag and drop a captured observation image above.
                </p>
              </div>
              <button
                onClick={() => setCameraNotice(null)}
                className="text-cyan-600 hover:text-cyan-800 p-1"
                aria-label="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main Dropzone Card (Visible when no file is selected) */}
          {!selectedFile && (
            <Card className="border-border/80 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 sm:p-8">
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Drop zone for telescope images. Click or drag files to upload."
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer select-none group ${
                    dragActive
                      ? 'border-cyan-500 bg-cyan-50/50 scale-[0.99] ring-4 ring-cyan-500/10'
                      : 'border-border hover:border-cyan-500/60 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500'
                  }`}
                  onClick={triggerFilePicker}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      triggerFilePicker();
                    }
                  }}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
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
                    or{' '}
                    <span className="text-cyan-600 font-semibold underline underline-offset-2 hover:text-cyan-700">
                      browse files
                    </span>{' '}
                    from your device
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground/75">
                    <span className="px-2 py-0.5 rounded bg-muted/60">JPG</span>
                    <span className="px-2 py-0.5 rounded bg-muted/60">PNG</span>
                    <span className="px-2 py-0.5 rounded bg-muted/60">TIFF</span>
                    <span className="px-2 py-0.5 rounded bg-muted/60">WEBP</span>
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
                  onClick={handleCameraClick}
                >
                  <Camera className="w-4 h-4 text-cyan-600" />
                  <span>Capture Direct from Eyepiece Camera</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Selected File Image Preview Card */}
          {selectedFile && (
            <Card className="border-cyan-500/30 bg-gradient-to-br from-white via-cyan-50/15 to-blue-50/15 animate-fade-in shadow-md overflow-hidden">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Actual Image Thumbnail Preview */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/20 shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src={selectedFile.previewUrl}
                        alt={selectedFile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to render
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <ImageIcon className="w-8 h-8 text-cyan-400/50 absolute" style={{ zIndex: 0 }} />
                    </div>

                    {/* Metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm sm:text-base font-bold text-foreground truncate max-w-[200px] sm:max-w-[280px]">
                          {selectedFile.name}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {selectedFile.sizeFormatted} · Telescope Eyepiece Capture
                      </p>
                    </div>
                  </div>

                  {/* Actions: Remove / Choose Another */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={triggerFilePicker}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Choose another image
                    </Button>
                    <button
                      onClick={handleRemoveFile}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-muted-foreground"
                      aria-label="Remove selected image"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Identify CTA Button */}
                <Button
                  className="w-full h-12 text-sm font-semibold shadow-md shadow-cyan-500/25"
                  variant="astro"
                  onClick={handleIdentify}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Identify Object</span>
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
                  onClick={handleAskAstroLens}
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
