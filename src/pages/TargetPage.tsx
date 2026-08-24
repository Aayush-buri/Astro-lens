import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Compass,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingState';
import { ScrollReveal } from '@/components/ScrollReveal';
import { suggestedTargets, tonightVisibility } from '@/data/mockData';

type TargetStep = 'search' | 'checking' | 'result';

const typeIcons: Record<string, string> = {
  Moon: '🌙',
  Planet: '🪐',
  Star: '⭐',
  Galaxy: '🌌',
};

const typeColors: Record<string, string> = {
  Planet: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Moon: 'bg-slate-50 text-slate-700 border-slate-200/60',
  Star: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Galaxy: 'bg-purple-50 text-purple-700 border-purple-200/60',
};

export function TargetPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<TargetStep>('search');
  const [query, setQuery] = useState('');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const filteredTargets = query.trim()
    ? suggestedTargets.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      )
    : suggestedTargets;

  const handleSelect = useCallback((targetName: string) => {
    setSelectedTarget(targetName);
    setStep('checking');
    setTimeout(() => setStep('result'), 1800);
  }, []);

  const handleReset = useCallback(() => {
    setStep('search');
    setSelectedTarget(null);
    setQuery('');
  }, []);

  const visibility = selectedTarget
    ? tonightVisibility.find(
        (v) => v.objectName.toLowerCase() === selectedTarget.toLowerCase()
      )
    : null;

  const isVisible = visibility?.isVisible ?? false;

  return (
    <div className="page-container max-w-4xl space-y-8">
      {/* ─── Header ─── */}
      <div className="animate-slide-up text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-blue-500" />
          <span>Telescope Target Planner</span>
        </div>
        <h1 className="section-heading text-3xl sm:text-4xl">What do you want to see?</h1>
        <p className="section-subtitle">
          Search for any celestial object and check if it's currently visible in your sky tonight.
        </p>
      </div>

      {/* ─── STEP 1: SEARCH & SUGGESTIONS ─── */}
      {step === 'search' && (
        <div className="max-w-2xl mx-auto space-y-6 animate-slide-up stagger-1">
          {/* Polished Search Input */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-cyan-600 transition-colors" />
            <Input
              placeholder="Search planets, stars, galaxies, or the Moon..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-12 pr-10 text-base rounded-2xl border-border/80 shadow-xs focus:ring-2 focus:ring-cyan-500/25 focus:border-cyan-500 transition-all"
              aria-label="Search celestial objects"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Target Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {query ? `Search Results (${filteredTargets.length})` : 'Popular Tonight Targets'}
              </p>
              <span className="text-xs text-muted-foreground">Select to check visibility</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {filteredTargets.map((target) => (
                <Card
                  key={target.id}
                  className="cursor-pointer border-border/80 hover:border-cyan-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                  onClick={() => handleSelect(target.name)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-accent/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-2xl">{typeIcons[target.type] || '✨'}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {target.name}
                        </h3>
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-0.5 ${typeColors[target.type] || 'bg-muted text-muted-foreground'}`}
                        >
                          {target.type}
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-accent/40 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTargets.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-2xl p-6 bg-accent/20">
                <p className="text-muted-foreground font-medium">
                  No celestial objects found matching "{query}"
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="mt-3 text-sm text-cyan-600 font-semibold hover:underline"
                >
                  Clear search query
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── STEP 2: CHECKING EPHEMERIS VISIBILITY ─── */}
      {step === 'checking' && (
        <div className="max-w-md mx-auto py-6">
          <Card className="border-border/80 shadow-md">
            <CardContent className="p-8">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                  Ephemeris Calculation
                </span>
                <h2 className="text-2xl font-extrabold text-foreground mt-1">
                  {selectedTarget}
                </h2>
              </div>
              <LoadingState
                message="Calculating sky position & visibility..."
                steps={[
                  'Computing observer horizon angles',
                  'Checking atmospheric transparency',
                  'Verifying obstruction clearance',
                ]}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─── STEP 3: VISIBILITY RESULT ─── */}
      {step === 'result' && (
        <div className="max-w-lg mx-auto animate-fade-in-scale">
          <Card className="border-border/80 shadow-xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Astrometric Visibility Result
                </span>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight mt-1">
                  {selectedTarget}
                </h2>
              </div>

              {isVisible && visibility ? (
                <>
                  {/* Positive Visibility Badge */}
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-4 py-2 rounded-full shadow-xs">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-sm">Visible Tonight · {visibility.quality} Quality</span>
                  </div>

                  {/* Astrometric Data Cards */}
                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3.5 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-blue-900">Optimal Observation Window</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {visibility.bestViewingStart} – {visibility.bestViewingEnd}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-3.5 bg-cyan-50/50 border border-cyan-100 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-cyan-900">Current Sky Position</p>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          Azimuth {visibility.azimuth}° · Altitude {visibility.altitude}°
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <Button
                    variant="astro"
                    size="lg"
                    className="w-full shadow-md shadow-cyan-500/25"
                    onClick={() => navigate('/guide')}
                  >
                    <Compass className="w-4 h-4 mr-1.5" />
                    <span>Guide Telescope to {selectedTarget}</span>
                  </Button>
                </>
              ) : (
                <>
                  {/* Negative Visibility Badge */}
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200/80 px-4 py-2 rounded-full">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-sm">Below Horizon Tonight</span>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 bg-accent/40 border border-border/60 rounded-xl text-left">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Next Estimated Rise</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">
                        Tomorrow at 9:20 PM
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full h-11"
                    onClick={handleReset}
                  >
                    <span>Choose Another Celestial Target</span>
                  </Button>
                </>
              )}

              {/* Reset Search Action */}
              <div className="pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Search for another target</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
