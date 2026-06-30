import { X, CalendarDays, FileText, Package, TrendingDown, TrendingUp, Hash } from 'lucide-react';

export default function LiftDetailModal({ record, onClose }) {
  if (!record) return null;

  const totalQty    = record.lots.reduce((s, l) => s + (l.totalQty  || 0), 0);
  const totalLift   = record.lots.reduce((s, l) => s + (l.liftQty   || 0), 0);
  const totalPending = record.lots.reduce((s, l) => s + (l.pendingQty || 0), 0);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl flex flex-col max-h-[92vh]"
        style={{ animation: 'fadeInZoom 0.18s ease' }}
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Lift Record
                </span>
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {record.liftNo}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Created on {new Date(record.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Hash size={9} /> Lot Count
              </p>
              <p className="text-lg font-extrabold text-slate-800">{record.lots.length}</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Package size={9} /> Total Qty
              </p>
              <p className="text-lg font-extrabold text-blue-700">{totalQty.toLocaleString()} <span className="text-xs font-semibold">MT</span></p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <TrendingUp size={9} /> Lift Qty
              </p>
              <p className="text-lg font-extrabold text-emerald-700">{totalLift.toLocaleString()} <span className="text-xs font-semibold">MT</span></p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <TrendingDown size={9} /> Pending Qty
              </p>
              <p className="text-lg font-extrabold text-amber-700">{totalPending.toLocaleString()} <span className="text-xs font-semibold">MT</span></p>
            </div>
          </div>

          {/* ── Work Order Details ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarDays size={10} /> Start Date
              </p>
              <p className="text-sm font-bold text-slate-800">{record.startDate || '—'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CalendarDays size={10} /> Target Completion Date
              </p>
              <p className="text-sm font-bold text-slate-800">{record.targetCompletionDate || '—'}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FileText size={10} /> Terms
              </p>
              <p className="text-sm font-bold text-slate-800">{record.terms || '—'}</p>
            </div>
          </div>

          {/* ── Lots Table ── */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 mb-3">Lots in this Lift</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lot No</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Work Order No</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lifter</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Total Qty (MT)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Lift Qty (MT)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Pending Qty (MT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.lots.map((l, idx) => (
                      <tr key={l.lotId || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 text-[10px] font-bold text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3 text-xs font-bold text-slate-900 whitespace-nowrap">{l.lotNo}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-indigo-700 whitespace-nowrap">{l.woNo || '—'}</td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{l.lifter || '—'}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap text-right">
                          {(l.totalQty || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs font-bold text-emerald-700 whitespace-nowrap text-right">
                          {(l.liftQty || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[48px] ${
                            (l.pendingQty || 0) === 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {(l.pendingQty || 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-t-2 border-slate-200">
                      <td colSpan={4} className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Total ({record.lots.length} lots)
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-slate-800 text-right whitespace-nowrap">
                        {totalQty.toLocaleString()} MT
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-emerald-700 text-right whitespace-nowrap">
                        {totalLift.toLocaleString()} MT
                      </td>
                      <td className="px-4 py-2.5 text-xs font-bold text-amber-700 text-right whitespace-nowrap">
                        {totalPending.toLocaleString()} MT
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex justify-end rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInZoom {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
