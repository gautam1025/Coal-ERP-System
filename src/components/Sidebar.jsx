import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutGrid, 
  FileText, 
  Hammer, 
  Wallet, 
  TrendingUp, 
  FileCheck, 
  CreditCard, 
  Send, 
  Briefcase, 
  Truck, 
  ShoppingCart, 
  GitMerge, 
  Receipt, 
  DollarSign, 
  Percent, 
  RotateCcw, 
  BarChart3,
  UserCheck,
  FileSignature,
  Route,
  Building2,
  Landmark,
  MapPin,
  Flame,
  LifeBuoy,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  Database,
  Sliders
} from 'lucide-react';
import divineLogo from '../Assets/divine-logo.svg';

const sidebarGroups = [
  {
    id: 'master_data',
    title: 'Master Registries',
    icon: Database,
    items: [
      { path: '/masters/firms',   name: 'Firm Master',               icon: Building2 },
      { path: '/masters/sources', name: 'Coal Company / Source',     icon: Landmark },
      { path: '/masters/mines',   name: 'Mine Master',               icon: MapPin },
      { path: '/masters/grades',  name: 'Coal Grade Master',         icon: Flame },
    ]
  },
  {
    id: 'management_logs',
    title: 'Operational Hub',
    icon: Sliders,
    items: [
      { path: '/support', name: 'Support Hub', icon: LifeBuoy },
      { path: '/audit', name: 'Audit Trail', icon: Shield },
      { path: '/reports', name: 'Reports Hub', icon: BarChart3 },
      { path: '/settings', name: 'Settings', icon: Settings },
    ]
  }
];

const workflowGroups = [
  {
    id: 'auction_bidding',
    title: 'Auction & Bidding',
    icon: Hammer,
    items: [
      { path: '/workflow/auction', name: 'Auction Notification', icon: Hammer },
      { path: '/workflow/emd', name: 'EMD Management', icon: Wallet },
      { path: '/workflow/bid', name: 'Bid Management', icon: TrendingUp },
      { path: '/workflow/sale-letter', name: 'Sale Letter', icon: FileText }
    ]
  },
  {
    id: 'do_processing',
    title: 'DO Processing',
    icon: FileCheck,
    items: [
      { path: '/workflow/payment-advice', name: 'Payment Advice', icon: FileCheck },
      { path: '/workflow/government-payment', name: 'Government Payment', icon: CreditCard },
      { path: '/workflow/application-submission', name: 'Application Submission', icon: Send },
      { path: '/workflow/delivery-order', name: 'Delivery Order', icon: Briefcase }
    ]
  },
  {
    id: 'coal_operations',
    title: 'Coal Operations',
    icon: Truck,
    items: [
      { path: '/workflow/lifter-management', name: 'Lifter Assignment', icon: UserCheck },
      { path: '/workflow/lifting-work-order', name: 'Work Order', icon: FileSignature },
      { path: '/workflow/truck-dispatch', name: 'Dispatch', icon: Truck }
    ]
  },
  {
    id: 'sales_allocation',
    title: 'Sales & Allocation',
    icon: ShoppingCart,
    items: [
      { path: '/workflow/customer-order', name: 'Customer Order', icon: ShoppingCart },
      { path: '/workflow/do-allocation', name: 'Allocation', icon: GitMerge },
      { path: '/workflow/invoice', name: 'Invoice', icon: Receipt }
    ]
  },
  {
    id: 'finance_settlement',
    title: 'Finance & Settlement',
    icon: DollarSign,
    items: [
      { path: '/workflow/collection', name: 'Collection', icon: DollarSign },
      { path: '/workflow/transport', name: 'Transport Payment', icon: Route },
      { path: '/workflow/commission', name: 'Commission', icon: Percent },
      { path: '/workflow/refund', name: 'Refund / Lapse', icon: RotateCcw },
      { path: '/workflow/profitability', name: 'Profitability', icon: BarChart3 }
    ]
  }
];

const linkBase = 'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 text-xs font-medium w-full';
const linkActive = 'bg-slate-900 text-white font-semibold shadow-sm';
const linkInactive = 'text-slate-505 hover:bg-slate-50 hover:text-slate-800';

const Sidebar = ({ user, isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Initialize group collapse state based on active path
  const [openGroups, setOpenGroups] = useState(() => {
    const states = {};
    workflowGroups.forEach(group => {
      states[group.id] = group.items.some(item => item.path === currentPath);
    });
    sidebarGroups.forEach(group => {
      states[group.id] = group.items.some(item => item.path === currentPath);
    });
    return states;
  });

  const toggleGroup = (id) => {
    setOpenGroups(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Sync open states when path changes
  useEffect(() => {
    workflowGroups.forEach(group => {
      if (group.items.some(item => item.path === currentPath)) {
        setOpenGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
    sidebarGroups.forEach(group => {
      if (group.items.some(item => item.path === currentPath)) {
        setOpenGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
  }, [currentPath]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full
          w-64 sm:w-72 lg:w-56 2xl:w-60
          bg-white border-r border-slate-200
          z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-slate-900 leading-tight">Coal ERP</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 scrollbar-hide space-y-0.5">

          <NavLink
            to="/dashboard"
            end
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <LayoutGrid size={15} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/deal/DEAL-2026-001"
            onClick={onClose}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkInactive}`
            }
          >
            <FileText size={15} />
            <span>Deal 360</span>
          </NavLink>

          {workflowGroups.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id];

            return (
              <div key={group.id} className="space-y-0.5">
                {/* Collapsible Section Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold w-full text-slate-600 hover:bg-slate-50 hover:text-slate-800`}
                >
                  <div className="flex items-center gap-2.5">
                    <GroupIcon size={15} className="text-slate-400 shrink-0" />
                    <span>{group.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </button>

                {/* Sub-stages list */}
                {isOpen && (
                  <div className="pl-3.5 border-l border-slate-100 ml-5 space-y-0.5 mt-0.5 animate-in slide-in-from-top-1 duration-100">
                    {group.items.map((stage) => {
                      const StageIcon = stage.icon;
                      return (
                        <NavLink
                          key={stage.path}
                          to={stage.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium w-full ${
                              isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                            }`
                          }
                        >
                          <StageIcon size={13} className="shrink-0 text-slate-400" />
                          <span className="truncate">{stage.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {sidebarGroups.filter(g => g.id === 'master_data').map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id];

            return (
              <div key={group.id} className="space-y-0.5">
                {/* Collapsible Section Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold w-full text-slate-600 hover:bg-slate-50 hover:text-slate-800`}
                >
                  <div className="flex items-center gap-2.5">
                    <GroupIcon size={15} className="text-slate-400 shrink-0" />
                    <span>{group.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </button>

                {/* Sub-items list */}
                {isOpen && (
                  <div className="pl-3.5 border-l border-slate-100 ml-5 space-y-0.5 mt-0.5 animate-in slide-in-from-top-1 duration-100">
                    {group.items.map((m) => {
                      const StageIcon = m.icon;
                      return (
                        <NavLink
                          key={m.path}
                          to={m.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium w-full ${
                              isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50/50'
                            }`
                          }
                        >
                          <StageIcon size={13} className="shrink-0 text-slate-400" />
                          <span className="truncate">{m.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {sidebarGroups.filter(g => g.id === 'management_logs').map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id];

            return (
              <div key={group.id} className="space-y-0.5">
                {/* Collapsible Section Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-semibold w-full text-slate-600 hover:bg-slate-50 hover:text-slate-800`}
                >
                  <div className="flex items-center gap-2.5">
                    <GroupIcon size={15} className="text-slate-400 shrink-0" />
                    <span>{group.title}</span>
                  </div>
                  {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </button>

                {/* Sub-items list */}
                {isOpen && (
                  <div className="pl-3.5 border-l border-slate-100 ml-5 space-y-0.5 mt-0.5 animate-in slide-in-from-top-1 duration-100">
                    {group.items.map((m) => {
                      const StageIcon = m.icon;
                      return (
                        <NavLink
                          key={m.path}
                          to={m.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[11px] font-medium w-full ${
                              isActive ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50/50'
                            }`
                          }
                        >
                          <StageIcon size={13} className="shrink-0 text-slate-400" />
                          <span className="truncate">{m.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-3 border-t border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-200 bg-white">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {(user?.name || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                {user?.role || 'EMPLOYEE'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;