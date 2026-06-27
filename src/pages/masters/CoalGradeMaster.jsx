import { useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Shield, Flame, Activity } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

export default function CoalGradeMaster({ data, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGrade, setNewGrade] = useState({ gradeName: '', gcv: '', ashPercent: '', moisturePercent: '', coalType: 'Thermal', remarks: '' });

  // Filter grades
  const filteredGrades = (data || []).filter(g => 
    (g.gradeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.coalType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (g.remarks || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newGrade.gradeName || !newGrade.gcv || !newGrade.ashPercent || !newGrade.moisturePercent) return;
    onAdd(newGrade);
    setNewGrade({ gradeName: '', gcv: '', ashPercent: '', moisturePercent: '', coalType: 'Thermal', remarks: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Master Registry</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Coal Grade Master</h1>
          <p className="text-sm text-slate-500 mt-1">Manage chemical qualities, Gross Calorific Value (GCV), ash limits and coal types.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-fit"
        >
          <PlusCircle size={15} /> Add Grade Spec
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Registered Grades"
          value={data.length}
          icon={Flame}
          description="Grades defined in catalog"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Avg GCV Value"
          value="3,800 kcal/kg"
          icon={Activity}
          description="Thermal heat release average"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="Primary Grade Mode"
          value="Thermal Coal"
          icon={Shield}
          description="Type classification of inventory"
          gradient="from-sky-500 to-cyan-500"
        />
      </div>

      {/* Table & Filter Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by grade name, type, remarks..."
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
                {['SN', 'Grade Name', 'GCV Value (kcal/kg)', 'Ash %', 'Moisture %', 'Coal Type', 'Remarks / Details', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.length > 0 ? (
                filteredGrades.map((grade, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{grade.gradeName}</td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-700">{grade.gcv} GCV</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-650">{grade.ashPercent}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-650">{grade.moisturePercent}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        grade.coalType === 'Thermal'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {grade.coalType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{grade.remarks || '—'}</td>
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
                          onClick={() => onDelete(grade.gradeName)}
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
                  <td colSpan={8} className="px-6 py-14 text-center text-slate-400 text-xs">
                    No coal grades matching your search query.
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
              <h3 className="font-bold text-slate-800 text-sm">Add Grade Spec</h3>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Grade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. G11"
                    value={newGrade.gradeName}
                    onChange={e => setNewGrade({ ...newGrade, gradeName: e.target.value.toUpperCase() })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">GCV (kcal/kg)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 3500"
                    value={newGrade.gcv}
                    onChange={e => setNewGrade({ ...newGrade, gcv: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ash %</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20%"
                    value={newGrade.ashPercent}
                    onChange={e => setNewGrade({ ...newGrade, ashPercent: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Moisture %</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10%"
                    value={newGrade.moisturePercent}
                    onChange={e => setNewGrade({ ...newGrade, moisturePercent: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Coal Type</label>
                  <select
                    value={newGrade.coalType}
                    onChange={e => setNewGrade({ ...newGrade, coalType: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                  >
                    <option value="Thermal">Thermal</option>
                    <option value="Coking">Coking</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Secondary demo grade"
                    value={newGrade.remarks}
                    onChange={e => setNewGrade({ ...newGrade, remarks: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
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
                  Create Spec
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
