import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNavigation } from './Navigation';

export function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
}
