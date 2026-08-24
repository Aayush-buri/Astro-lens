import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, MapPin, Clock, CheckCircle2, XCircle, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/LoadingState';
import { suggestedTargets, tonightVisibility } from '@/data/mockData';

type TargetStep = 'search' | 'checking' | 'result';

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
    setTimeout(() => setStep('result'), 2000);
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
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="section-heading">What do you want to see?</h1>
        <p className="section-subtitle">
          Search for a celestial object and check if it's visible tonight.
        </p>
      </div>

      {step === 'search' && (
        <div className="max-w-2xl mx-auto animate-slide-up stagger-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search celestial object..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 pl-12 text-base rounded-xl"
              aria-label="Search celestial objects"
            />
          </div>

          {/* Suggested Targets */}
          <div className="mt-6">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              {query ? 'Search results' : 'Suggested targets'}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredTargets.map((target) => (
                <Card
                  key={target.id}
                  className="cursor-pointer hover:border-primary/30 hover:shadow-md transition-all"
                  onClick={() => handleSelect(target.name)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{target.name}</h3>
                      <p className="text-xs text-muted-foreground">{target.type}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredTargets.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No objects found matching "{query}"
              </p>
            )}
          </div>
        </div>
      )}

      {step === 'checking' && (
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">{selectedTarget?.toUpperCase()}</h2>
          <LoadingState message="Checking visibility..." />
        </div>
      )}

      {step === 'result' && (
        <div className="max-w-lg mx-auto animate-slide-up">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">{selectedTarget}</h2>

              {isVisible && visibility ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full mb-6">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Visible tonight</span>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                      <Clock className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Best viewing</p>
                        <p className="text-sm text-muted-foreground">
                          {visibility.bestViewingStart} – {visibility.bestViewingEnd}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Current position</p>
                        <p className="text-sm text-muted-foreground">
                          Azimuth {visibility.azimuth}° · Altitude {visibility.altitude}°
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="astro"
                    className="w-full mt-6"
                    onClick={() => navigate('/guide')}
                  >
                    <Compass className="w-4 h-4" />
                    Guide Me
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full mb-6">
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">Not visible right now</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg mb-6">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Best viewing</p>
                      <p className="text-sm text-muted-foreground">
                        Tomorrow at 9:20 PM
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                  >
                    Choose Another Object
                  </Button>
                </>
              )}

              <button
                onClick={handleReset}
                className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Search for something else
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
