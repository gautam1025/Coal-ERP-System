import { useState } from 'react';
import {
  FileArchive, CheckSquare, Bell, ClipboardCheck,
  UploadCloud, Eye, Trash2, Plus, Clock, AlertTriangle,
  CheckCircle2, CircleDot, ChevronRight, FileText, Download
} from 'lucide-react';
import MetricCard from '../../components/MetricCard';

// ── Demo Data ──────────────────────────────────────────────────────────────
const DEMO_DOCUMENTS = [
  { id: 1, name: 'Auction Notice',           type: 'PDF', uploadedOn: '10 Jan 2026', size: '1.2 MB', status: 'verified',  tags: ['Auction'] },
  { id: 2, name: 'EMD Proof',                type: 'PDF', uploadedOn: '12 Jan 2026', size: '0.8 MB', status: 'verified',  tags: ['EMD'] },
  { id: 3, name: 'Sale Letter',              type: 'PDF', uploadedOn: '20 Jan 2026', size: '1.5 MB', status: 'verified',  tags: ['Sale Letter'] },
  { id: 4, name: 'Government Payment UTR',   type: 'PNG', uploadedOn: '08 Feb 2026', size: '0.4 MB', status: 'verified',  tags: ['Payment'] },
  { id: 5, name: 'Application Receipt',      type: 'PDF', uploadedOn: '12 Feb 2026', size: '0.6 MB', status: 'pending',   tags: ['Application'] },
  { id: 6, name: 'Delivery Order (DO)',      type: 'PDF', uploadedOn: '20 Feb 2026', size: '1.1 MB', status: 'verified',  tags: ['DO'] },
  { id: 7, name: 'Lifting Work Order',       type: 'PDF', uploadedOn: '22 Feb 2026', size: '0.9 MB', status: 'pending',   tags: ['Operations'] },
  { id: 8, name: 'Invoice INV-2026-018',     type: 'PDF', uploadedOn: '01 Mar 2026', size: '0.7 MB', status: 'verified',  tags: ['Billing'] },
  { id: 9, name: 'Transport Bill TB-01',     type: 'PDF', uploadedOn: '10 Mar 2026', size: '0.5 MB', status: 'missing',   tags: ['Transport'] },
];

const DEMO_TASKS = [
  { id: 1, task: 'Send DO copy to ABC Lifter',              dueDate: '2026-04-05', priority: 'High',   status: 'open',       dealId: 'DEAL-2026-001' },
  { id: 2, task: 'Prepare Lifting Work Order WO-ASAK-01',   dueDate: '2026-04-08', priority: 'High',   status: 'open',       dealId: 'DEAL-2026-001' },
  { id: 3, task: 'Raise Invoice for 6750 MT dispatched',    dueDate: '2026-04-10', priority: 'Medium', status: 'done',       dealId: 'DEAL-2026-001' },
  { id: 4, task: 'Follow up collection - XYZ Sponge',       dueDate: '2026-04-12', priority: 'High',   status: 'open',       dealId: 'DEAL-2026-001' },
  { id: 5, task: 'Confirm transport payable approval',       dueDate: '2026-04-15', priority: 'Medium', status: 'open',       dealId: 'DEAL-2026-001' },
  { id: 6, task: 'Submit EMD refund claim for LOT-02',      dueDate: '2026-04-20', priority: 'Low',    status: 'open',       dealId: 'DEAL-2026-001' },
  { id: 7, task: 'Verify commission payable to Shyam Ag.',  dueDate: '2026-04-22', priority: 'Medium', status: 'done',       dealId: 'DEAL-2026-001' },
];

const DEMO_ALERTS = [
  { id: 1, type: 'danger',  message: 'DO expiring in 7 days — renew before Apr 15 2026',       module: 'Delivery Order' },
  { id: 2, type: 'warning', message: 'Customer collection pending: ₹1.38 Cr outstanding',        module: 'Collection' },
  { id: 3, type: 'warning', message: 'Transport bill TB-SHREE-01 not yet received',              module: 'Transport' },
  { id: 4, type: 'info',    message: 'LOT-2026-002 is awaiting application submission approval', module: 'Application' },
  { id: 5, type: 'danger',  message: 'LOT-2026-003 EMD Management — no action taken',           module: 'EMD' },
  { id: 6, type: 'info',    message: 'Government payment confirmed for LOT-2026-001',            module: 'Govt Payment' },
];

const DEMO_APPROVALS = [
  { id: 1, title: 'Transport Payable — TB-SHREE-01',       amount: '₹13,50,000', requestedBy: 'Transport Coordinator', status: 'pending',  date: '2026-03-20' },
  { id: 2, title: 'Commission Payable — Shyam Agencies',   amount: '₹3,37,500',  requestedBy: 'Accounts Team',         status: 'approved', date: '2026-03-18' },
  { id: 3, title: 'EMD Refund Claim — LOT-2026-002',       amount: '₹7,50,000',  requestedBy: 'Finance Team',          status: 'pending',  date: '2026-04-01' },
  { id: 4, title: 'Invoice Credit Note — INV-2026-018',    amount: '₹1,20,000',  requestedBy: 'Billing Team',          status: 'rejected', date: '2026-03-25' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const docStatus = {
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  missing:  'bg-rose-50 text-rose-700 border-rose-200',
};
const alertStyles = {
  danger:  { bar: 'border-rose-400 bg-rose-50',   icon: 'text-rose-500',   badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  warning: { bar: 'border-amber-400 bg-amber-50', icon: 'text-amber-500',  badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  info:    { bar: 'border-sky-400 bg-sky-50',     icon: 'text-sky-500',    badge: 'bg-sky-100 text-sky-700 border-sky-200' },
};
const priorityBadge = {
  High:   'bg-rose-50 text-rose-700 border-rose-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low:    'bg-slate-100 text-slate-500 border-slate-200',
};
const approvalStatus = {
  pending:  'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

const TABS = [
  { id: 'documents',  label: 'Documents',  icon: FileArchive },
  { id: 'tasks',      label: 'Tasks',      icon: CheckSquare },
  { id: 'alerts',     label: 'Alerts',     icon: Bell },
  { id: 'approvals',  label: 'Approvals',  icon: ClipboardCheck },
];

// ── Component ──────────────────────────────────────────────────────────────
export default function SupportHub() {
  const [activeTab, setActiveTab]     = useState('documents');
  const [tasks, setTasks]             = useState(DEMO_TASKS);
  const [approvals, setApprovals]     = useState(DEMO_APPROVALS);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'open' : 'done' } : t
    ));
  };

  const handleApproval = (id, action) => {
    setApprovals(prev => prev.map(a =>
      a.id === id ? { ...a, status: action } : a
    ));
  };

  const openCount  = tasks.filter(t => t.status === 'open').length;
  const alertCount = DEMO_ALERTS.filter(a => a.type === 'danger').length;
  const pendingAp  = approvals.filter(a => a.status === 'pending').length;
  const missingDoc = DEMO_DOCUMENTS.filter(d => d.status === 'missing').length;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Open Tasks"         value={openCount}    icon={CheckSquare}   description="Require team action"         gradient="from-indigo-500 to-blue-500" />
        <MetricCard title="Critical Alerts"    value={alertCount}   icon={AlertTriangle} description="Danger-level system alerts"   gradient="from-rose-500 to-red-500" />
        <MetricCard title="Pending Approvals"  value={pendingAp}    icon={ClipboardCheck} description="Awaiting director sign-off"  gradient="from-amber-500 to-orange-500" />
        <MetricCard title="Missing Documents"  value={missingDoc}   icon={FileArchive}   description="Docs not yet uploaded"        gradient="from-emerald-500 to-teal-500" />
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100/70 rounded-2xl p-1 w-full sm:w-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-initial justify-center sm:justify-start ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Documents Tab ─────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Document Vault</h2>
              <p className="text-xs text-slate-400 mt-0.5">All files linked to DEAL-2026-001</p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm">
              <UploadCloud size={13} /> Upload File
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['#', 'Document Name', 'Type', 'Tags', 'Uploaded On', 'Size', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEMO_DOCUMENTS.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-[11px] text-slate-400 font-semibold">{idx + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[11px] font-mono text-slate-500 font-bold">{doc.type}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 flex-wrap">
                        {doc.tags.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold border border-slate-200">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-slate-500 whitespace-nowrap">{doc.uploadedOn}</td>
                    <td className="px-5 py-3.5 text-[11px] text-slate-500">{doc.size}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${docStatus[doc.status]}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"><Eye size={13} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"><Download size={13} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tasks Tab ─────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Task Reminders</h2>
                <p className="text-xs text-slate-400 mt-0.5">{openCount} open · {tasks.length - openCount} completed</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl transition shadow-sm">
                <Plus size={13} /> Add Task
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {tasks.map(task => (
                <div key={task.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors ${task.status === 'done' ? 'opacity-60' : ''}`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      task.status === 'done'
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-indigo-400'
                    }`}
                  >
                    {task.status === 'done' && <CheckCircle2 size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold text-slate-900 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                      {task.task}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-[10px] text-slate-400">Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityBadge[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Alerts Tab ────────────────────────────────────────── */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          {DEMO_ALERTS.map(alert => {
            const s = alertStyles[alert.type];
            return (
              <div key={alert.id} className={`flex items-start gap-4 rounded-2xl border-l-4 p-4 ${s.bar}`}>
                <AlertTriangle size={18} className={`shrink-0 mt-0.5 ${s.icon}`} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-900">{alert.message}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Module: {alert.module}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${s.badge}`}>
                  {alert.type}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Approvals Tab ─────────────────────────────────────── */}
      {activeTab === 'approvals' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">Approval Workflow</h2>
            <p className="text-xs text-slate-400 mt-0.5">{pendingAp} pending approvals require director action</p>
          </div>
          <div className="divide-y divide-slate-100">
            {approvals.map(ap => (
              <div key={ap.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900">{ap.title}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500">Requested by: <span className="font-semibold text-slate-700">{ap.requestedBy}</span></span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] text-slate-500">{ap.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-extrabold text-slate-900">{ap.amount}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${approvalStatus[ap.status]}`}>
                    {ap.status}
                  </span>
                  {ap.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleApproval(ap.id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(ap.id, 'rejected')}
                        className="px-3 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-[11px] font-bold transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
