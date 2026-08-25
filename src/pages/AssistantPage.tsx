import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CelestialObjectVisual } from '@/components/astronomy';
import {
  mockChatResponses,
  defaultChatResponse,
  objectSuggestedPrompts,
} from '@/data/mockData';
import { getSavedCurrentObservation } from '@/lib/astronomy';
import type { ChatMessage, CurrentObservationState } from '@/types';

export function AssistantPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Read current observation from route state or session storage
  const currentObservation = useMemo<CurrentObservationState | null>(() => {
    const fromState = (location.state?.currentObservation || location.state?.object) as
      | CurrentObservationState
      | undefined;
    if (fromState && (fromState.objectName || fromState.objectId)) {
      return {
        objectId: fromState.objectId || fromState.objectName.toLowerCase(),
        objectName: fromState.objectName || fromState.objectId,
        confidence: fromState.confidence || 94,
        imagePreview: fromState.imagePreview || null,
      };
    }
    return getSavedCurrentObservation();
  }, [location.state]);

  const objectKey = currentObservation
    ? currentObservation.objectId?.toLowerCase() || currentObservation.objectName.toLowerCase()
    : 'default';

  // Dynamic suggested prompts based on current object
  const suggestedPrompts = useMemo(() => {
    return objectSuggestedPrompts[objectKey] || objectSuggestedPrompts.default;
  }, [objectKey]);

  // Initial welcome message tailored to the current observation
  const welcomeText = useMemo(() => {
    if (currentObservation) {
      return `You're currently observing ${currentObservation.objectName}. Ask me anything about what you're seeing, and I'll help you understand the night sky! 🌌`;
    }
    return `Welcome to Ask AstroLens! Ask me any question about the night sky, planets, stars, constellations, or how to operate your telescope. 🌌`;
  }, [currentObservation]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: welcomeText,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Update welcome message if currentObservation changes
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [welcomeText]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      const query = text.trim();
      if (!query || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        // Look up response in mockChatResponses, or find matching keyword, or use default
        let response = mockChatResponses[query];
        if (!response) {
          // Attempt case-insensitive match
          const foundKey = Object.keys(mockChatResponses).find(
            (k) => k.toLowerCase() === query.toLowerCase()
          );
          if (foundKey) {
            response = mockChatResponses[foundKey];
          } else {
            response = defaultChatResponse;
          }
        }

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, 1000);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] lg:h-screen">
      {/* Header */}
      <div className="border-b bg-white/70 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Ask AstroLens</h1>
                <p className="text-xs text-muted-foreground">
                  Your guide to understanding the night sky
                </p>
              </div>
            </div>

            {currentObservation && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigate('/guide', { state: { currentObservation } })
                }
                className="hidden sm:inline-flex text-xs h-8"
              >
                <Compass className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                <span>Guide to Target</span>
              </Button>
            )}
          </div>

          {/* Dynamic Active Observation Status */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40 text-xs">
            {currentObservation ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <CelestialObjectVisual
                  objectId={currentObservation.objectId}
                  objectName={currentObservation.objectName}
                  visualKey={currentObservation.visualKey}
                  size="xs"
                />
                <span>
                  Current object:{' '}
                  <strong className="text-foreground font-semibold">
                    {currentObservation.objectName}
                  </strong>
                </span>
                <span className="text-[11px] text-muted-foreground/80 font-medium">
                  ({currentObservation.confidence}% match)
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>
                    Current object:{' '}
                    <strong className="text-muted-foreground font-semibold">None</strong>
                  </span>
                </div>
                <button
                  onClick={() => navigate('/identify')}
                  className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline"
                >
                  Identify an Object
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Viewport */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 pb-24 lg:pb-4 space-y-4"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-slide-up ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 text-cyan-600">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md shadow-xs'
                    : 'bg-accent/80 border border-border/40 rounded-bl-md text-foreground'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 mt-0.5 text-primary-foreground shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-accent/80 border border-border/40 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5 h-4">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-cyan-500 rounded-full typing-dot" />
                  <span className="w-2 h-2 bg-cyan-500 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}

          {/* Object-Specific Suggested Prompts */}
          {messages.length <= 1 && !isTyping && (
            <div className="pt-3 animate-fade-in">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                {currentObservation
                  ? `Suggested questions about ${currentObservation.objectName}:`
                  : 'Suggested questions:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs bg-white border border-border/80 rounded-full px-3.5 py-1.5 text-muted-foreground hover:text-cyan-700 hover:border-cyan-500/50 hover:bg-cyan-50/40 transition-all font-medium shadow-2xs hover:shadow-xs text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t bg-white/80 backdrop-blur-md px-4 sm:px-6 py-3 mb-16 lg:mb-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              currentObservation
                ? `Ask about ${currentObservation.objectName} or the night sky...`
                : 'Ask about any planet, star, or telescope topic...'
            }
            className="flex-1 rounded-xl h-11"
            disabled={isTyping}
            aria-label="Type your astronomy question"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            className="h-11 w-11 rounded-xl shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
