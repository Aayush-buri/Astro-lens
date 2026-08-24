import { useEffect, useRef, useState } from 'react';

interface ConfidenceBarProps {
  value: number;
  label?: string;
  animate?: boolean;
}

export function ConfidenceBar({ value, label, animate = true }: ConfidenceBarProps) {
  const [displayWidth, setDisplayWidth] = useState(0);
  const mounted = useRef(false);

  const getColor = (v: number) => {
    if (v >= 90) return 'from-emerald-400 to-emerald-500';
    if (v >= 70) return 'from-amber-400 to-amber-500';
    return 'from-red-400 to-red-500';
  };

  const getTextColor = (v: number) => {
    if (v >= 90) return 'text-emerald-600';
    if (v >= 70) return 'text-amber-600';
    return 'text-red-500';
  };

  useEffect(() => {
    if (!animate) {
      setDisplayWidth(value);
      return;
    }
    // Slight delay so animation fires after mount
    const t = setTimeout(() => {
      setDisplayWidth(value);
      mounted.current = true;
    }, 80);
    return () => clearTimeout(t);
  }, [value, animate]);

  const isHigh = value >= 90;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label || 'Confidence'}</span>
        <span className={`text-sm font-semibold ${getTextColor(value)}`}>{value}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(value)} relative overflow-hidden transition-all duration-700 ease-out`}
          style={{ width: `${displayWidth}%` }}
        >
          {/* Shimmer overlay */}
          {isHigh && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: 'shimmer 2.5s ease-in-out infinite' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
