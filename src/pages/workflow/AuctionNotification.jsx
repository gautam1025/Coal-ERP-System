import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ClipboardList, 
  Search, 
  Download, 
  CheckCircle,
  Play,
  Eye,
  Edit2
} from 'lucide-react';
import { WORKFLOW_STAGES, getWorkflowData, transitionLotStage } from '../../data/workflowStore';
import ProcessModal from './ProcessModal';

export default function AuctionNotification() {
  const [lots, setLots] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load data on mount
  const loadData = () => {
    setLots(getWorkflowData());
  };

  useEffect(() => {
    loadData();
  }, []);

  const stage = WORKFLOW_STAGES.find(s => s.id === 'auction') || WORKFLOW_STAGES[0];

  // Filter lots: show all lots (both pending and completed in auction stage)
  const filteredLots = lots.filter(lot => {
    // If a lot doesn't have auction status, default to pending (for new templates)
    const hasStatus = lot.stages && lot.stages[stage.id];
    if (!hasStatus) return false;

    // Filter by search query
    if (searchQuery.trim() === '') return true;
    const query = searchQuery.toLowerCase();
    return (
      lot.lotNo.toLowerCase().includes(query) ||
      (lot.firm || '').toLowerCase().includes(query) ||
      (lot.mine || '').toLowerCase().includes(query) ||
      (lot.source || '').toLowerCase().includes(query)
    );
  });

  const handleCreateSubmit = (formData) => {
    setIsProcessing(true);
    setIsCreating(false);

    setTimeout(() => {
      const freshLots = getWorkflowData();
      const nextLotId = 'LOT-' + Date.now();
      const defaultLotNo = formData.lotNo || ('LOT-2026-' + Math.floor(100 + Math.random() * 900));
      const defaultDealId = formData.dealId || ('DEAL-2026-' + Math.floor(100 + Math.random() * 900));

      const newLot = {
        id: nextLotId,
        lotNo: defaultLotNo,
        dealId: defaultDealId,
        ...formData,
        stages: {
          'auction': 'pending',
          'emd': 'pending',
          'bid': 'pending',
          'sale-letter': 'pending',
          'payment-advice': 'pending',
          'government-payment': 'pending',
          'application-submission': 'pending',
          'delivery-order': 'pending',
          'lifter-management': 'pending',
          'lifting-work-order': 'pending',
          'truck-dispatch': 'pending',
          'customer-order': 'pending',
          'do-allocation': 'pending',
          'invoice': 'pending',
          'collection': 'pending',
          'transport': 'pending',
          'commission': 'pending',
          'refund': 'pending',
          'profitability': 'pending'
        }
      };

      freshLots.push(newLot);
      localStorage.setItem('coal_workflow_lots', JSON.stringify(freshLots));
      setLots(freshLots);
      setIsProcessing(false);
      toast.success('New Auction entry created in Pending status!');
    }, 450);
  };

  const handleEditSubmit = (formData) => {
    setIsProcessing(true);
    setSelectedLot(null);

    // Save details and transition this lot to history (which unlocks EMD as pending)
    setTimeout(() => {
      transitionLotStage(selectedLot.id, stage.id, formData);
      loadData();
      setIsProcessing(false);
      toast.success(`Auction saved successfully! EMD Management is now Pending.`);
    }, 450);
  };

  const handleExportCSV = () => {
    toast.success('CSV Exported successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        
        {/* Single Tab Header */}
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-indigo-100 bg-white shadow-xs">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <ClipboardList size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Auction Notifications</p>
            <p className="text-[10px] text-slate-450">All registered notifications</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto shrink-0 flex-col sm:flex-row">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-full sm:w-auto"
          >
            <span>+ Add New Auction</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-full sm:w-auto"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Search header */}
        <div className="p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder={`Search by Lot, Firm, Mine, Source...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
                {stage.columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLots.length > 0 ? (
                filteredLots.map((lot, idx) => {
                  const isPending = lot.stages[stage.id] === 'pending';

                  return (
                    <tr key={lot.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      {/* Actions Column */}
                      <td className="px-6 py-4">
                        {isPending ? (
                          <button
                            onClick={() => setSelectedLot(lot)}
                            className="px-3.5 py-1.5 border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                          >
                            <Edit2 size={10} /> Edit & Process
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                              <CheckCircle size={10} /> Processed
                            </span>
                            <button
                              onClick={() => setSelectedLot(lot)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-650 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <Eye size={10} /> View
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Dynamic Columns */}
                      {stage.columns.map((col, cIdx) => {
                        const val = lot[col.key];
                        const formatted = typeof val === 'number' && (col.key.toLowerCase().includes('amount') || col.key.toLowerCase().includes('payable') || col.key.toLowerCase().includes('value') || col.key.toLowerCase().includes('cost') || col.key.toLowerCase().includes('rate'))
                          ? val.toLocaleString()
                          : typeof val === 'number' && col.key === 'quantity'
                          ? val.toLocaleString()
                          : val;

                        return (
                          <td key={cIdx} className="px-6 py-4 text-xs text-slate-900 whitespace-nowrap font-medium">
                            {col.key === 'lotNo' ? (
                              <span className="font-bold text-slate-950">{formatted}</span>
                            ) : col.key === 'firm' ? (
                              <span className="text-indigo-650 font-semibold">{formatted}</span>
                            ) : (
                              formatted || '—'
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={stage.columns.length + 1} className="px-6 py-14 text-center text-slate-400 text-xs font-medium">
                    {searchQuery ? 'No matching logs found' : 'No logs found in this category'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Creation Modal */}
      {isCreating && (
        <ProcessModal
          stage={stage}
          lot={{
            id: 'LOT-NEW',
            lotNo: 'LOT-2026-' + Math.floor(100 + Math.random() * 900),
            dealId: 'DEAL-2026-' + Math.floor(100 + Math.random() * 900),
            stages: { 'auction': 'pending' }
          }}
          onSubmit={handleCreateSubmit}
          onClose={() => setIsCreating(false)}
        />
      )}

      {/* Edit / Transition Modal */}
      {selectedLot && (
        <ProcessModal 
          stage={stage} 
          lot={selectedLot} 
          onSubmit={handleEditSubmit} 
          onClose={() => setSelectedLot(null)} 
        />
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center z-[110]">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center space-y-4 max-w-xs text-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-semibold text-slate-800">Processing lot transaction...</span>
            <span className="text-[10px] text-slate-400">Please wait while we update the workflow ledger</span>
          </div>
        </div>
      )}
    </div>
  );
}
