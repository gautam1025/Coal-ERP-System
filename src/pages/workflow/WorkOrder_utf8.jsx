import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ClipboardList,
  History,
  Search,
  Download,
  Play,
  Eye,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  WORKFLOW_STAGES,
  getWorkflowData,
  saveWorkflowData,
  getLiftRecords,
  generateLiftNumber,
  saveLiftRecord,
} from '../../data/workflowStore';
import WorkOrderProcessModal from './WorkOrderProcessModal';
import LiftDetailModal from './LiftDetailModal';

const STAGE_ID = 'lifting-work-order';

export default function WorkOrder() {
  const [lots, setLots] = useState([]);
  const [liftRecords, setLiftRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal state
  const [selectedLot, setSelectedLot] = useState(null);       // open process modal
  const [viewRecord, setViewRecord] = useState(null);         // open lift-detail modal

  const stage = WORKFLOW_STAGES.find(s => s.id === STAGE_ID) || WORKFLOW_STAGES[0];

  const loadData = () => {
    setLots(getWorkflowData());
    setLiftRecords(getLiftRecords());
  };

  useEffect(() => {
    loadData();
    setActiveTab('pending');
  }, []);

  /* ── derived ─────────────────────────────────────── */
  const pendingLots = lots.filter(l => l.stages[STAGE_ID] === 'pending');
  const allPendingLots = pendingLots; // alias for modal

  const filteredPending = pendingLots.filter(lot => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      lot.lotNo.toLowerCase().includes(q) ||
      (lot.firm   || '').toLowerCase().includes(q) ||
      (lot.lifter || '').toLowerCase().includes(q) ||
      (lot.woNo   || '').toLowerCase().includes(q)
    );
  });

  const filteredRecords = liftRecords.filter(rec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      rec.liftNo.toLowerCase().includes(q) ||
      rec.lots.some(l =>
        l.lotNo.toLowerCase().includes(q) ||
        (l.lifter || '').toLowerCase().includes(q) ||
        (l.woNo   || '').toLowerCase().includes(q)
      )
    );
  });

  /* ── handlers ────�  const handleModalSubmit = ({ startDate, targetCompletionDate, terms, selectedLotIds, liftQtyMap }) => {
    setIsProcessing(true);
    setSelectedLot(null);

    setTimeout(() => {
      const allData  = getWorkflowData();
      const stageIdx = WORKFLOW_STAGES.findIndex(s => s.id === STAGE_ID);
      const nextStage = WORKFLOW_STAGES[stageIdx + 1];

      // Build lift record lots array (ALL selected lots go into the record)
      const liftLots = [];

      const updated = allData.map(lot => {
        if (!selectedLotIds.includes(lot.id)) return lot;

        const newLiftQty    = liftQtyMap?.[lot.id] ?? lot.liftQty ?? 0;
        const newPendingQty = Math.max(0, (lot.quantity || 0) - newLiftQty);
        const isFullyLifted = newPendingQty === 0;

        // Always record in lift history (even partial lifts)
        liftLots.push({
          lotId:      lot.id,
          lotNo:      lot.lotNo,
          woNo:       lot.woNo   || '',
          lifter:     lot.lifter || '',
          totalQty:   lot.quantity || 0,
          liftQty:    newLiftQty,
          pendingQty: newPendingQty,
        });

        const newLot = {
          ...lot,
          startDate,
          targetCompletionDate,
          terms,
          liftQty:    newLiftQty,
          pendingQty: newPendingQty,
        };

        // ── Only move to History when FULLY lifted (pendingQty === 0) ──
        if (isFullyLifted) {
          newLot.stages = { ...newLot.stages, [STAGE_ID]: 'history' };
          if (nextStage) {
            newLot.stages[nextStage.id] = 'pending';
            if (nextStage.id === 'truck-dispatch' && !newLot.transporter) {
              newLot.transporter = 'Shree Transport';
              newLot.trucks      = Math.floor(20 + Math.random() * 100);
              newLot.dispatchQty = Math.floor((newLot.quantity || 0) * 0.6);
            }
          }
        }
        // else: lot stays as 'pending' with updated liftQty / pendingQty

        return newLot;
      });
floor(20 + Math.random() * 100);
            newLot.dispatchQty = Math.floor((newLot.quantity || 0) * 0.6);
          }
        }
        return newLot;
      });

      // Generate unique lift number and persist
      const liftNo = generateLiftNumber();
      saveLiftRecord({
        liftNo,
        createdAt: new Date().toISOString(),
        startDate,
        targetCompletionDate,
        terms,
        lots: liftLots,
      });

      saveWorkflowData(updated);
      loadData();
      setIsProcessing(false);
      toast.success(`${selectedLotIds.length} lot(s) processed — Lift No: ${liftNo}`);
    }, 450);
  };

  const handleExportCSV = () => toast.success('CSV Exported successfully!');

  /* ── tab counts ──────────────────────────────────── */
  const pendingCount = lots.filter(l => l.stages[STAGE_ID] === 'pending').length;
  const historyCount = liftRecords.length;

  /* ── summary totals for history tab ─────────────── */
  const histTotal  = liftRecords.reduce((s, r) => s + r.lots.reduce((a, l) => a + (l.totalQty  || 0), 0), 0);
  const histLift   = liftRecords.reduce((s, r) => s + r.lots.reduce((a, l) => a + (l.liftQty   || 0), 0), 0);
  const histPending = liftRecords.reduce((s, r) => s + r.lots.reduce((a, l) => a + (l.pendingQty || 0), 0), 0);

  /* ═══════════════════════════════════════════════════ RENDER ═══ */
  return (
    <div className="space-y-6">

      {/* ── Tab Row ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-3 w-full sm:w-auto">

          {/* Pending Tab */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial flex items-center justify-between gap-8 p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'pending'
                ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                : 'bg-white/60 hover:bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${activeTab === 'pending' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                <ClipboardList size={18} />
              </div>
              <div>
                <p className={`text-xs font-bold ${activeTab === 'pending' ? 'text-slate-800' : 'text-slate-500'}`}>Pending</p>
                <p className="text-[10px] text-slate-400">Awaiting processing</p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${activeTab === 'pending' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
              {pendingCount}
            </div>
          </button>

          {/* History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-initial flex items-center justify-between gap-8 p-4 rounded-2xl border text-left transition-all ${
              activeTab === 'history'
                ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/20'
                : 'bg-white/60 hover:bg-white border-slate-200 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${activeTab === 'history' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                <History size={18} />
              </div>
              <div>
                <p className={`text-xs font-bold ${activeTab === 'history' ? 'text-slate-800' : 'text-slate-500'}`}>History</p>
                <p className="text-[10px] text-slate-400">Completed lifts</p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
              {historyCount}
            </div>
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 w-full sm:w-auto"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Table/Records Container ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Search */}
        <div className="p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={activeTab === 'pending'
                ? 'Search by Lot, Lifter, Work Order No...'
                : 'Search by Lift No, Lot, Lifter...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* ════════ PENDING TAB ════════ */}
        {activeTab === 'pending' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lot No</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Work Order No</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lifter</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Total Quantity (MT)</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Lift Quantity (MT)</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Pending Quantity (MT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPending.length > 0 ? (
                  filteredPending.map((lot, idx) => {
                    const totalQty   = lot.quantity   || 0;
                    const liftQty    = lot.liftQty    || 0;
                    const pendingQty = lot.pendingQty != null ? lot.pendingQty : Math.max(0, totalQty - liftQty);
                    return (
                      <tr key={lot.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleProcessClick(lot)}
                            disabled={isProcessing}
                            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Play size={10} className="fill-current" /> Process
                          </button>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-slate-950 whitespace-nowrap">{lot.lotNo}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-indigo-700 whitespace-nowrap">{lot.woNo || '—'}</td>
                        <td className="px-6 py-4 text-xs text-slate-700 whitespace-nowrap">{lot.lifter || '—'}</td>
                        <td className="px-6 py-4 text-xs text-slate-900 font-medium whitespace-nowrap text-right">
                          {totalQty.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-xs text-emerald-700 font-semibold whitespace-nowrap text-right">
                          {liftQty.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            pendingQty === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {pendingQty.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-slate-400 text-xs font-medium">
                      {searchQuery ? 'No matching lots found' : 'No pending lots'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ════════ HISTORY TAB ════════ */}
        {activeTab === 'history' && (
          <>
            {/* Summary strip */}
            {liftRecords.length > 0 && (
              <div className="flex gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/40">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-500">Total Qty:</span>
                  <span className="font-extrabold text-slate-800">{histTotal.toLocaleString()} MT</span>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="flex items-center gap-2 text-xs">
                  <TrendingUp size={12} className="text-emerald-600" />
                  <span className="font-bold text-slate-500">Lifted:</span>
                  <span className="font-extrabold text-emerald-700">{histLift.toLocaleString()} MT</span>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="flex items-center gap-2 text-xs">
                  <TrendingDown size={12} className="text-amber-500" />
                  <span className="font-bold text-slate-500">Pending:</span>
                  <span className="font-extrabold text-amber-700">{histPending.toLocaleString()} MT</span>
                </div>
              </div>
            )}

            {/* Lift records table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">View</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lift No</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Date Created</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Start Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Target Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Terms</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-center">Lots</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Total Qty (MT)</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Lift Qty (MT)</th>
                    <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Pending Qty (MT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((rec, idx) => {
                      const rTotal   = rec.lots.reduce((s, l) => s + (l.totalQty   || 0), 0);
                      const rLift    = rec.lots.reduce((s, l) => s + (l.liftQty    || 0), 0);
                      const rPending = rec.lots.reduce((s, l) => s + (l.pendingQty || 0), 0);
                      return (
                        <tr key={rec.liftNo || idx} className="hover:bg-slate-50/80 transition-colors">
                          {/* View button */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setViewRecord(rec)}
                              className="px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <Eye size={10} /> View
                            </button>
                          </td>

                          {/* Lift No – pill badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-extrabold rounded-lg">
                              <Package size={10} />
                              {rec.liftNo}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                            {new Date(rec.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-700 font-medium whitespace-nowrap">{rec.startDate || '—'}</td>
                          <td className="px-6 py-4 text-xs text-slate-700 font-medium whitespace-nowrap">{rec.targetCompletionDate || '—'}</td>
                          <td className="px-6 py-4 text-xs text-slate-700 whitespace-nowrap max-w-[120px] truncate">{rec.terms || '—'}</td>

                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-full">
                              {rec.lots.length}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-xs font-semibold text-slate-800 whitespace-nowrap text-right">
                            {rTotal.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-emerald-700 whitespace-nowrap text-right">
                            {rLift.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              rPending === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {rPending.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-14 text-center text-slate-400 text-xs font-medium">
                        {searchQuery ? 'No matching lift records found' : 'No lift records yet — process a work order to see history'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── Process Modal ── */}
      {selectedLot && (
        <WorkOrderProcessModal
          stage={stage}
          lot={selectedLot}
          allPendingLots={allPendingLots}
          onSubmit={handleModalSubmit}
          onClose={() => setSelectedLot(null)}
        />
      )}

      {/* ── Lift Detail Modal ── */}
      {viewRecord && (
        <LiftDetailModal
          record={viewRecord}
          onClose={() => setViewRecord(null)}
        />
      )}

      {/* ── Loading Overlay ── */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center z-[110]">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center space-y-4 max-w-xs text-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-sm font-semibold text-slate-800">Processing work orders…</span>
            <span className="text-[10px] text-slate-400">Please wait while we update the workflow ledger</span>
          </div>
        </div>
      )}
    </div>
  );
}

