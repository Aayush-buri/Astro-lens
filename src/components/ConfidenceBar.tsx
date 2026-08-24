import { Progress } from '@/components/ui/progress';

interface ConfidenceBarProps {
  value: number;
  label?: string;
}

export function ConfidenceBar({ value, label }: ConfidenceBarProps) {
  const getColor = (v: number) => {
    if (v >= 90) return 'text-emerald-600';
    if (v >= 70) return 'text-amber-600';
    return 'text-red-500';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{label || 'Confidence'}</span>
        <span className={`text-sm font-semibold ${getColor(value)}`}>{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
