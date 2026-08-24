import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar, MobileNavigation } from './Navigation';

export function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-cyan-500/20 selection:text-cyan-900">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area with Route Transition */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
        <div key={location.pathname} className="animate-page-in">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />
    </div>
  );
}
