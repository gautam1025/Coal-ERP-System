import { useState } from 'react';
import { Search, Clock, Shield, User, Filter, AlertCircle } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

const DEMO_LOGS = [
  { id: 1, user: 'Coal Demo Admin', role: 'ADMIN', action: 'Approved EMD Payment of ₹25,00,000', timestamp: '2026-01-12 11:30:22', ip: '192.168.1.12', module: 'EMD' },
  { id: 2, user: 'Bid Team Officer', role: 'USER', action: 'Created bid submission for 10,000 MT at ₹4,200/MT', timestamp: '2026-01-15 15:45:10', ip: '192.168.1.18', module: 'Bidding' },
  { id: 3, user: 'Accounts Team Manager', role: 'USER', action: 'Generated Payment Advice PA-SECL-001', timestamp: '2026-02-05 14:15:33', ip: '192.168.1.5', module: 'Finance' },
  { id: 4, user: 'Coal Demo Admin', role: 'ADMIN', action: 'Uploaded verified Government Payment receipt (UTR: SBI98231)', timestamp: '2026-02-08 10:20:00', ip: '192.168.1.12', module: 'Finance' },
  { id: 5, user: 'Operations Team Lead', role: 'USER', action: 'Assigned ABC Lifter to DO-SECL-001 (DO Qty: 10,000 MT)', timestamp: '2026-02-21 09:20:15', ip: '192.168.1.33', module: 'DO' },
  { id: 6, user: 'Transport Coordinator', role: 'USER', action: 'Dispatched 420 MT via Shree Transport (Truck No: CG-04-E-4322)', timestamp: '2026-03-01 18:05:40', ip: '192.168.1.25', module: 'Dispatch' },
  { id: 7, user: 'Billing Team Associate', role: 'USER', action: 'Issued Customer Invoice INV-2026-018 to XYZ Sponge Pvt Ltd', timestamp: '2026-03-01 19:30:11', ip: '192.168.1.42', module: 'Billing' },
  { id: 8, user: 'Accounts Team Manager', role: 'USER', action: 'Recorded collection of ₹1,85,00,000 from XYZ Sponge Pvt Ltd', timestamp: '2026-03-10 16:40:05', ip: '192.168.1.5', module: 'Collection' },
  { id: 9, user: 'Coal Demo Admin', role: 'ADMIN', action: 'Created new Coal Grade Master entry: G11 (GCV 3500)', timestamp: '2026-06-27 12:45:00', ip: '192.168.1.12', module: 'Masters' },
];

export default function AuditTrail() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  // Filter logic
  const filteredLogs = DEMO_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || 
                          log.action.toLowerCase().includes(search.toLowerCase()) ||
                          log.ip.includes(search);
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const modules = ['All', 'EMD', 'Bidding', 'DO', 'Dispatch', 'Billing', 'Collection', 'Masters', 'Finance'];

  return (
    <div className="space-y-6">
      {/* Metrics */}

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Events Logged"
          value={DEMO_LOGS.length}
          icon={Clock}
          description="Total database actions captured"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Admin Interventions"
          value={DEMO_LOGS.filter(l => l.role === 'ADMIN').length}
          icon={Shield}
          description="High level permission checks"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="Unique Users Active"
          value={new Set(DEMO_LOGS.map(l => l.user)).size}
          icon={User}
          description="Operator staff logs in workflow"
          gradient="from-sky-500 to-cyan-500"
        />
      </div>

      {/* Filter Options */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by action description, user, IP address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              {modules.map(mod => <option key={mod} value={mod}>{mod} Module</option>)}
            </select>
          </div>
        </div>

        {/* Activity Timeline List */}
        <div className="divide-y divide-slate-100">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-4 p-5 hover:bg-slate-50/50 transition-colors">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-650 border border-slate-200">
                  <Clock size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{log.user}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                        log.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {log.role}
                      </span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-[10px] text-slate-400 font-mono">IP: {log.ip}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2 font-medium bg-slate-50/60 border border-slate-100 rounded-xl p-3">
                    {log.action}
                  </p>
                  <div className="mt-2.5">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-bold border border-indigo-100">
                      {log.module}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-14 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <AlertCircle size={20} className="text-slate-300" />
              <span>No audit logs matching search query.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
