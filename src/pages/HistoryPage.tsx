import { useNavigate } from 'react-router-dom';
import { Clock, Star, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { observations, historyStats } from '@/data/mockData';

const typeIcons: Record<string, string> = {
  Planet: '🪐',
  Moon: '🌙',
  Star: '⭐',
  Galaxy: '🌌',
};

export function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="section-heading">My Observations</h1>
        <p className="section-subtitle">
          A record of your celestial discoveries.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-up stagger-1">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{historyStats.objectsDiscovered}</p>
              <p className="text-xs text-muted-foreground">Objects discovered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{historyStats.observationSessions}</p>
              <p className="text-xs text-muted-foreground">Observation sessions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observation List */}
      <div className="space-y-3 animate-slide-up stagger-2">
        {observations.map((obs) => (
          <Card
            key={obs.id}
            className="cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
            onClick={() => navigate(`/object/${obs.objectId}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{typeIcons[obs.objectType] || '✨'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{obs.objectName}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {obs.date} · {obs.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{obs.objectType}</p>
                  <div className="mt-2">
                    <ConfidenceBar value={obs.confidence} />
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Start New Observation */}
      <div className="mt-8 text-center">
        <Button variant="astro" onClick={() => navigate('/identify')}>
          Start New Observation
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
