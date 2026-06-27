import { useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Building, ShieldAlert, CheckCircle2 } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

export default function FirmMaster({ data, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFirm, setNewFirm] = useState({ firmName: '', gstNumber: '', pan: '', status: 'Active' });

  // Filter firms
  const filteredFirms = (data || []).filter(firm => 
    (firm.firmName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.gstNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (firm.pan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newFirm.firmName || !newFirm.gstNumber || !newFirm.pan) return;
    onAdd(newFirm);
    setNewFirm({ firmName: '', gstNumber: '', pan: '', status: 'Active' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Master Registry</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Firm Master</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active business entities and corporate profiles.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-fit"
        >
          <PlusCircle size={15} /> Add Business Firm
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Registered Firms"
          value={data.length}
          icon={Building}
          description="Entities available in workflows"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Active Entities"
          value={data.filter(f => f.status === 'Active').length}
          icon={CheckCircle2}
          description="Available for auction linking"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="Compliance Verified"
          value="100%"
          icon={ShieldAlert}
          description="GST & PAN validation status"
          gradient="from-sky-500 to-cyan-500"
        />
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by firm name, GSTIN, PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['SN', 'Firm Name', 'GST Number', 'PAN Card', 'Status', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFirms.length > 0 ? (
                filteredFirms.map((firm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{firm.firmName}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">{firm.gstNumber}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">{firm.pan}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        firm.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {firm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => alert('Editing is disabled in mock preview')}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(firm.firmName)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400 text-xs">
                    No firms matching your search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Add New Business Firm</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Firm Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jai Bhole Traders"
                  value={newFirm.firmName}
                  onChange={e => setNewFirm({ ...newFirm, firmName: e.target.value })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">GSTIN</label>
                  <input
                    type="text"
                    required
                    placeholder="22AAAAA0000A1Z5"
                    value={newFirm.gstNumber}
                    onChange={e => setNewFirm({ ...newFirm, gstNumber: e.target.value.toUpperCase() })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">PAN Card</label>
                  <input
                    type="text"
                    required
                    placeholder="AAAAA0000A"
                    value={newFirm.pan}
                    onChange={e => setNewFirm({ ...newFirm, pan: e.target.value.toUpperCase() })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Initial Status</label>
                <select
                  value={newFirm.status}
                  onChange={e => setNewFirm({ ...newFirm, status: e.target.value })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Register Firm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
