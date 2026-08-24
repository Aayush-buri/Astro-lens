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
    <aside className="hidden lg:flex flex-col w-64 border-r bg-white/50 backdrop-blur-sm min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <NavLink to="/" className="flex items-center gap-3 group" aria-label="AstroLens home">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
            <Telescope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">ASTROLENS</h1>
            <p className="text-[11px] text-muted-foreground -mt-0.5">AI Telescope Assistant</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="px-3 py-2">
          <p className="text-xs text-muted-foreground">Frontend Prototype</p>
          <p className="text-xs text-muted-foreground/60">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t safe-area-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-[10px] font-medium transition-all min-w-[56px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label === 'Ask AstroLens' ? 'Ask' : item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
