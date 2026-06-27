import { Bell, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { WORKFLOW_STAGES } from '../data/workflowStore';

const Header = ({ onMenuClick, user }) => {
  const location = useLocation();

  const getHeaderData = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return {
        title: 'Coal Trading Dashboard',
      };
    }
    if (path === '/deal/DEAL-2026-001') {
      return {
        title: 'DEAL-2026-001',
      };
    }
    if (path === '/support') {
      return {
        title: 'Support Hub',
      };
    }
    if (path === '/audit') {
      return {  
        title: 'Audit Trail',
      };
    }
    if (path === '/reports') {
      return {
        title: 'Reports Hub',
      };
    }
    if (path === '/settings') {
      return {
        title: 'Settings Manager',
      };
    }
    
    // Parse stage paths
    if (path.startsWith('/workflow/')) {
      const stageId = path.split('/')[2];
      const stageIndex = WORKFLOW_STAGES.findIndex(s => s.id === stageId);
      const stage = WORKFLOW_STAGES[stageIndex];
      if (stage) {
        return {
          category: 'Coal Deal Workflow',
          title: `Stage ${stageIndex + 1}: ${stage.title}`,
        };
      }
    }
    
    return null;
  };

  const headerData = getHeaderData();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-center py-2.5 px-4 sm:px-6 min-h-[3.5rem]">

        {/* Left: Mobile hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="block">
            <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight">
              {headerData ? headerData.title : 'Coal ERP'}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          <div className="flex items-center gap-2.5 group cursor-default" title="Coal demo user">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-700">{user?.name || 'Admin'}</p>
              <p className="text-[10px] font-semibold text-indigo-505 uppercase tracking-wider">
                {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex items-center justify-center border border-slate-200 bg-white">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white group-hover:bg-indigo-700 transition-colors">
                  {(user?.name || 'A')[0].toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </header>
  );
};

export default Header;
