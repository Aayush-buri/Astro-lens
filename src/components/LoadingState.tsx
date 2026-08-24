import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  steps?: string[];
}

const defaultSteps = [
  'Processing image',
  'Enhancing observation',
  'Identifying object',
];

export function LoadingState({ message = 'Looking at your observation...', steps }: LoadingStateProps) {
  const activeSteps = steps ?? defaultSteps;
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Reveal each step progressively
    activeSteps.forEach((_, i) => {
      if (i < activeSteps.length - 1) {
        timers.push(
          setTimeout(() => {
            setCompletedSteps((prev) => [...prev, i]);
            setActiveStep(i + 1);
          }, (i + 1) * 750)
        );
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [activeSteps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Scanner visual */}
      <div className="relative mb-8" style={{ width: 120, height: 120 }}>
        {/* Outer pulsing ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-300/30"
          style={{ animation: 'scanPulse 2s ease-in-out infinite' }}
        />
        {/* Second ring */}
        <div className="absolute inset-3 rounded-full border border-blue-400/20" />
        {/* Rotating sweep */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ animation: 'scanRotate 2.5s linear infinite' }}
        >
          <div
            className="absolute top-1/2 left-1/2 h-px rounded-full"
            style={{
              width: '50%',
              background: 'linear-gradient(to right, transparent, rgba(6,182,212,0.85))',
              transformOrigin: 'left center',
              transform: 'translateY(-50%)',
            }}
          />
        </div>
        {/* Tick marks on ring */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transform: `rotate(${deg}deg)` }}
          >
            <div className="w-px h-2 bg-cyan-400/40 mt-0" />
          </div>
        ))}
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2"
          style={{
            boxShadow: '0 0 12px rgba(6,182,212,0.8)',
            animation: 'scanPulse 2s ease-in-out infinite',
          }}
        />
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm" />
      </div>

      {/* Message */}
      <p className="text-base font-medium text-foreground mb-6 text-center">{message}</p>

      {/* Progressive steps */}
      <div className="space-y-2.5 w-full max-w-xs">
        {activeSteps.map((step, i) => {
          const isDone = completedSteps.includes(i);
          const isActive = activeStep === i && !isDone;
          const isPending = !isDone && !isActive;

          return (
            <div
              key={step}
              className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isActive ? (
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400"
                    style={{ animation: 'scanPulse 1.2s ease-in-out infinite' }}
                  />
                </div>
              ) : (
                <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                </div>
              )}
              <span
                className={
                  isDone
                    ? 'text-emerald-600 font-medium'
                    : isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
