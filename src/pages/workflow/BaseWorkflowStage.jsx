import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  ClipboardList, 
  History, 
  Search, 
  Download, 
  CheckCircle,
  Clock,
  Play,
  Eye
} from 'lucide-react';
import { WORKFLOW_STAGES, getWorkflowData, transitionLotStage } from '../../data/workflowStore';
import ProcessModal from './ProcessModal';

export default function BaseWorkflowStage({ stageId, refreshKey }) {
  const [lots, setLots] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  // Load workflow data
  const loadData = () => {
    setLots(getWorkflowData());
  };

  useEffect(() => {
    loadData();
    // Default tab resets to pending on stage change
    setActiveTab('pending');
  }, [stageId, refreshKey]);


  // Find stage definition
  const stageIndex = WORKFLOW_STAGES.findIndex(s => s.id === stageId);
  const stage = WORKFLOW_STAGES[stageIndex] || WORKFLOW_STAGES[0];

  // Filter lots belonging to this stage and matching search query
  const stageLots = lots.filter(lot => {
    const lotStageStatus = lot.stages[stage.id];
    
    // Check if lot is in correct status for tab
    if (activeTab === 'pending') {
      if (lotStageStatus !== 'pending') return false;
    } else {
      if (lotStageStatus !== 'history') return false;
    }

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

  // Count helper
  const getStageCount = (status) => {
    return lots.filter(lot => lot.stages[stage.id] === status).length;
  };

  const handleProcessClick = (lot) => {
    setSelectedLot(lot);
  };

  const handleModalSubmit = (formData) => {
    setIsProcessing(true);
    setSelectedLot(null);

    // Simulate minor delay for realistic feel
    setTimeout(() => {
      transitionLotStage(selectedLot.id, stage.id, formData);
      loadData();
      setIsProcessing(false);
      toast.success(`Lot processed successfully! Moved to next stage.`);
    }, 450);
  };

  const handleExportCSV = () => {
    toast.success('CSV Exported successfully!');
  };


  return (
    <div className="space-y-6">
      {/* Tabs Row (Styled like reference image) */}
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
              {getStageCount('pending')}
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
                <p className="text-[10px] text-slate-400">Completed</p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
              {getStageCount('history')}
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto shrink-0 flex-col sm:flex-row">
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
              {stageLots.length > 0 ? (
                stageLots.map((lot, idx) => (
                  <tr key={lot.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Actions Column */}
                    <td className="px-6 py-4">
                      {activeTab === 'pending' ? (
                        <button
                          onClick={() => handleProcessClick(lot)}
                          disabled={isProcessing}
                          className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-indigo-550 hover:text-white hover:border-indigo-600 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1 disabled:opacity-50"
                        >
                          <Play size={10} className="fill-current" /> Process
                        </button>
                      ) : (
                        <button
                          onClick={() => handleProcessClick(lot)}
                          className="px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-indigo-550 hover:text-white hover:border-indigo-600 text-slate-650 rounded-lg text-[10px] font-bold transition flex items-center gap-1"
                        >
                          <Eye size={10} /> View details
                        </button>
                      )}
                    </td>

                    {/* Dynamic Columns */}
                    {stage.columns.map((col, cIdx) => {
                      const val = lot[col.key];
                      const formatted = typeof val === 'number' && (col.key.toLowerCase().includes('amount') || col.key.toLowerCase().includes('payable') || col.key.toLowerCase().includes('value') || col.key.toLowerCase().includes('cost') || col.key.toLowerCase().includes('revenue') || col.key.toLowerCase().includes('expenses'))
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
                ))
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

      {/* Dynamic Process / View Modal */}
      {selectedLot && (
        <ProcessModal 
          stage={stage} 
          lot={selectedLot} 
          onSubmit={handleModalSubmit} 
          onClose={() => setSelectedLot(null)} 
        />
      )}


      {/* Loading Overlay for Processing */}
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
