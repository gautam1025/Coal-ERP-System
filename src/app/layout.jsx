import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = {
    name: 'Coal Demo Admin',
    role: 'ADMIN'
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-56 2xl:ml-60 h-screen relative">
        <Header onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 overflow-y-auto p-5 md:p-6 bg-slate-50">
          <div className="w-full max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
