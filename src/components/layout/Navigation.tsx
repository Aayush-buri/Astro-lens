import { NavLink } from 'react-router-dom';
import {
  Home,
  ScanSearch,
  Moon,
  Compass,
  MessageCircle,
  History,
  Telescope,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/identify', label: 'Identify', icon: ScanSearch },
  { to: '/night-sky', label: 'Night Sky', icon: Moon },
  { to: '/guide', label: 'Guide', icon: Compass },
  { to: '/assistant', label: 'Ask AstroLens', icon: MessageCircle },
  { to: '/history', label: 'History', icon: History },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/80 bg-white/70 backdrop-blur-md min-h-screen sticky top-0 z-30 select-none">
      {/* Logo */}
      <div className="p-6 border-b border-border/60">
        <NavLink
          to="/"
          className="flex items-center gap-3 group transition-transform duration-200"
          aria-label="AstroLens home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/25 group-hover:shadow-lg group-hover:shadow-cyan-500/35 group-hover:scale-105 transition-all duration-200">
            <Telescope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              ASTROLENS
            </h1>
            <p className="text-[11px] text-muted-foreground font-medium -mt-0.5">
              AI Telescope Assistant
            </p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1.5" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/80 hover:translate-x-0.5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-sm shadow-cyan-500/50 animate-fade-in"
                    aria-hidden="true"
                  />
                )}

                {/* Nav Item Icon */}
                <item.icon
                  className={cn(
                    'w-[18px] h-[18px] transition-colors duration-200',
                    isActive
                      ? 'text-cyan-600'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />

                {/* Nav Item Label */}
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / App Info */}
      <div className="p-4 border-t border-border/60">
        <div className="px-3 py-2 rounded-lg bg-accent/40 border border-border/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-medium text-foreground">AstroLens Active</p>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Frontend Prototype v1.0</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-border/80 safe-area-bottom shadow-lg shadow-black/5"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'text-primary font-semibold bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    isActive && 'text-cyan-600 scale-110'
                  )}
                />
                <span className="leading-tight">
                  {item.label === 'Ask AstroLens' ? 'Ask' : item.label}
                </span>

                {/* Mobile Active Indicator Dot */}
                {isActive && (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-cyan-500 absolute -bottom-0.5"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
