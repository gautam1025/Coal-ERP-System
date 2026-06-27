import { useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Shield, Activity, MapPin } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

export default function MineMaster({ data, onAdd, onDelete, companies = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMine, setNewMine] = useState({ mineName: '', coalCompany: 'SECL', location: '', coalGradeAvailable: '', loadingCapacity: 'Medium', averageLiftingSpeed: '' });

  // Filter mines
  const filteredMines = (data || []).filter(mine => 
    (mine.mineName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mine.coalCompany || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mine.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mine.coalGradeAvailable || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMine.mineName || !newMine.location || !newMine.coalGradeAvailable) return;
    onAdd(newMine);
    setNewMine({ mineName: '', coalCompany: 'SECL', location: '', coalGradeAvailable: '', loadingCapacity: 'Medium', averageLiftingSpeed: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Master Registry</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Mine Master</h1>
          <p className="text-sm text-slate-500 mt-1">Configure and manage active loading mines, logistics capacity, and locations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-fit"
        >
          <PlusCircle size={15} /> Register Mine
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Coal Mines"
          value={data.length}
          icon={MapPin}
          description="Active sources of lifting"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Lifting Rate Average"
          value="1,500 MT/d"
          icon={Activity}
          description="Average daily lifter speed"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="High Capacity Mines"
          value={data.filter(m => m.loadingCapacity === 'High').length}
          icon={Shield}
          description="Mines with rapid dispatch lines"
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
              placeholder="Search by mine name, coal company, location..."
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
                {['SN', 'Mine Name', 'Coal Company', 'Location', 'Grades Available', 'Loading Capacity', 'Lifting Speed', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMines.length > 0 ? (
                filteredMines.map((mine, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{mine.mineName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-indigo-700">{mine.coalCompany}</td>
                    <td className="px-6 py-4 text-xs text-slate-600">{mine.location}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-700">{mine.coalGradeAvailable}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        mine.loadingCapacity === 'High'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {mine.loadingCapacity} Capacity
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-semibold">{mine.averageLiftingSpeed || '—'}</td>
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
                          onClick={() => onDelete(mine.mineName)}
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
                    No mines matching your search query.
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
              <h3 className="font-bold text-slate-800 text-sm">Register New Mine</h3>
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
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mine Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kusmunda"
                    value={newMine.mineName}
                    onChange={e => setNewMine({ ...newMine, mineName: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Coal Company</label>
                  <select
                    value={newMine.coalCompany}
                    onChange={e => setNewMine({ ...newMine, coalCompany: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                  >
                    {companies.length > 0 ? (
                      companies.map(c => <option key={c.sourceName} value={c.sourceName}>{c.sourceName}</option>)
                    ) : (
                      <>
                        <option value="SECL">SECL</option>
                        <option value="MSTC">MSTC</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Korba, Chhattisgarh"
                  value={newMine.location}
                  onChange={e => setNewMine({ ...newMine, location: e.target.value })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Available Grades</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. G10, G11"
                    value={newMine.coalGradeAvailable}
                    onChange={e => setNewMine({ ...newMine, coalGradeAvailable: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Loading Capacity</label>
                  <select
                    value={newMine.loadingCapacity}
                    onChange={e => setNewMine({ ...newMine, loadingCapacity: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg. Lifting Speed (e.g. 1500 MT/day)</label>
                <input
                  type="text"
                  placeholder="e.g. 1200 MT/day"
                  value={newMine.averageLiftingSpeed}
                  onChange={e => setNewMine({ ...newMine, averageLiftingSpeed: e.target.value })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                />
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
                  Register Mine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
