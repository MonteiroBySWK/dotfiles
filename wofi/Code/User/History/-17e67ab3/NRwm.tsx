import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/admin/sidebar';
import { Header } from '@/components/admin/header';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
