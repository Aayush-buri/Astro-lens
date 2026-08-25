import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CelestialObjectVisual } from '@/components/astronomy';
import { tonightVisibility } from '@/data/mockData';

const qualityColors: Record<string, string> = {
  Excellent: 'bg-emerald-500',
  Good: 'bg-blue-500',
  Fair: 'bg-amber-500',
  Poor: 'bg-red-500',
};

const qualityBadgeColors: Record<string, string> = {
  Excellent: 'text-emerald-700 bg-emerald-50',
  Good: 'text-blue-700 bg-blue-50',
  Fair: 'text-amber-700 bg-amber-50',
  Poor: 'text-red-600 bg-red-50',
};

// Parse time like "7:00 PM" to hours for the timeline
function timeToHour(t: string): number {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = parseInt(match[1]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h;
}

export function NightSkyPage() {
  const navigate = useNavigate();
  const timelineStart = 19; // 7 PM
  const timelineEnd = 27;   // 3 AM (next day)
  const timelineSpan = timelineEnd - timelineStart;

  const featured = tonightVisibility[1]; // Jupiter

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="section-heading">Tonight's Sky</h1>
        <p className="section-subtitle">
          See what you can observe from your location tonight.
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Pune, India
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Tonight · 8:00 PM
          </span>
        </div>
      </div>

      {/* Featured Object */}
      <Card className="mb-6 overflow-hidden animate-slide-up stagger-1">
        <div className="astro-gradient p-6">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-medium mb-2 uppercase tracking-wider">
            <Star className="w-3.5 h-3.5" />
            Featured Tonight
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">{featured.objectName}</h2>
              <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${qualityBadgeColors[featured.quality]}`}>
                {featured.quality} visibility
              </span>
              <p className="text-blue-100/70 text-sm mt-3">
                Best viewing: {featured.bestViewingStart} – {featured.bestViewingEnd}
              </p>
            </div>
            <CelestialObjectVisual
              objectId={featured.objectId}
              objectName={featured.objectName}
              objectType={featured.objectType}
              visualKey={featured.visualKey}
              size="lg"
              variant="badge"
            />
          </div>
          <Button
            variant="astro"
            size="sm"
            className="mt-4"
            onClick={() => navigate(`/object/${featured.objectId}`)}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>

      {/* Visibility Timeline */}
      <Card className="mb-6 animate-slide-up stagger-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Visibility Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Time axis */}
          <div className="relative">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-2 px-0.5">
              {['7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM', '1 AM', '2 AM', '3 AM'].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="space-y-2.5">
              {tonightVisibility.map((vis) => {
                let startHour = timeToHour(vis.bestViewingStart);
                let endHour = timeToHour(vis.bestViewingEnd);
                if (endHour < startHour) endHour += 24;
                const left = ((startHour - timelineStart) / timelineSpan) * 100;
                const width = ((endHour - startHour) / timelineSpan) * 100;

                return (
                  <div key={vis.objectId} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-24 truncate">{vis.objectName}</span>
                    <div className="flex-1 relative h-5 bg-secondary/50 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full rounded-full ${qualityColors[vis.quality]} opacity-30`}
                        style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%` }}
                      />
                      <div
                        className={`absolute h-full rounded-full ${qualityColors[vis.quality]}`}
                        style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(width, 100 - left)}%`, opacity: 0.7 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Object Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up stagger-3">
        {tonightVisibility.map((vis) => (
          <Card
            key={vis.objectId}
            className="cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
            onClick={() => navigate(`/object/${vis.objectId}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{vis.objectName}</h3>
                  <p className="text-xs text-muted-foreground">{vis.objectType}</p>
                </div>
                <CelestialObjectVisual
                  objectId={vis.objectId}
                  objectName={vis.objectName}
                  objectType={vis.objectType}
                  visualKey={vis.visualKey}
                  size="sm"
                />
              </div>

              <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${qualityBadgeColors[vis.quality]}`}>
                {vis.quality}
              </span>

              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {vis.bestViewingStart} – {vis.bestViewingEnd}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  Az {vis.azimuth}° · Alt {vis.altitude}°
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
