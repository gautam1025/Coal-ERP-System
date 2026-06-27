import { useState } from 'react';
import { PlusCircle, Search, Edit3, Trash2, Shield, Landmark, User } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

export default function CoalCompanyMaster({ data, onAdd, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCompany, setNewCompany] = useState({ sourceName: '', type: 'Government', contactPerson: '', paymentProcessNotes: '' });

  // Filter companies
  const filteredCompanies = (data || []).filter(c => 
    (c.sourceName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCompany.sourceName || !newCompany.contactPerson) return;
    onAdd(newCompany);
    setNewCompany({ sourceName: '', type: 'Government', contactPerson: '', paymentProcessNotes: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Master Registry</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Coal Company / Source Master</h1>
          <p className="text-sm text-slate-500 mt-1">Manage coal sourcing authorities, auction agents and contract channels.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition duration-150 shrink-0 w-fit"
        >
          <PlusCircle size={15} /> Add Coal Company
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Coal Sourcing Entities"
          value={data.length}
          icon={Landmark}
          description="Registered public / private portals"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Government Portals"
          value={data.filter(c => c.type === 'Government').length}
          icon={Shield}
          description="E.g. SECL, MSTC portal links"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="Active Contacts"
          value={data.map(c => c.contactPerson).filter(Boolean).length}
          icon={User}
          description="Assigned auction desk personnel"
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
              placeholder="Search by company name, type, contact..."
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
                {['SN', 'Company / Source Name', 'Type', 'Contact Person', 'Payment Rules & Process Notes', 'Actions'].map((h, i) => (
                  <th key={i} className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">{idx + 1}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{company.sourceName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        company.type === 'Government'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {company.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-semibold">{company.contactPerson}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 max-w-sm truncate" title={company.paymentProcessNotes}>
                      {company.paymentProcessNotes || '—'}
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
                          onClick={() => onDelete(company.sourceName)}
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
                    No coal companies matching your search query.
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
              <h3 className="font-bold text-slate-800 text-sm">Add New Coal Source</h3>
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
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Company / Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WCL"
                  value={newCompany.sourceName}
                  onChange={e => setNewCompany({ ...newCompany, sourceName: e.target.value.toUpperCase() })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Type</label>
                  <select
                    value={newCompany.type}
                    onChange={e => setNewCompany({ ...newCompany, type: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                  >
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sales Manager"
                    value={newCompany.contactPerson}
                    onChange={e => setNewCompany({ ...newCompany, contactPerson: e.target.value })}
                    className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Payment Process Notes</label>
                <textarea
                  placeholder="Describe EMD policies, BG rules or timing restrictions..."
                  value={newCompany.paymentProcessNotes}
                  onChange={e => setNewCompany({ ...newCompany, paymentProcessNotes: e.target.value })}
                  className="block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all h-20"
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
                  Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
