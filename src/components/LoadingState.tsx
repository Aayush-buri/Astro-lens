import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-secondary" />
        <Loader2 className="w-16 h-16 absolute top-0 left-0 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-muted-foreground font-medium">{message}</p>
    </div>
  );
}
