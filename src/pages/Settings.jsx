import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Edit2, Users, UserPlus, Save, X, Settings2, ShieldCheck, BadgeIndianRupee } from 'lucide-react';
import { getUsers, saveUsers } from '../utils/storageManager';

export default function Settings() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ id: '', name: '', password: '', role: 'USER' });

  // Sourcing Constants States
  const [handlingRate, setHandlingRate] = useState('65');
  const [commissionRate, setCommissionRate] = useState('50');
  const [tcsRate, setTcsRate] = useState('0.75');

  useEffect(() => {
    // Load local users
    setUsers(getUsers());

    // Load local config constants
    const cfgHandling = localStorage.getItem('coal_cfg_handling') || '65';
    const cfgCommission = localStorage.getItem('coal_cfg_commission') || '50';
    const cfgTcs = localStorage.getItem('coal_cfg_tcs') || '0.75';
    setHandlingRate(cfgHandling);
    setCommissionRate(cfgCommission);
    setTcsRate(cfgTcs);
  }, []);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('coal_cfg_handling', handlingRate);
    localStorage.setItem('coal_cfg_commission', commissionRate);
    localStorage.setItem('coal_cfg_tcs', tcsRate);
    toast.success('Configuration variables updated!');
  };

  const handleSaveUser = () => {
    if (!editingUser.name.trim() || !editingUser.password.trim()) {
      toast.error('Fill all fields');
      return;
    }
    const updated = users.map(u => u.id === editingUser.id ? editingUser : u);
    setUsers(updated);
    saveUsers(updated);
    setEditingUserId(null);
    setEditingUser(null);
    toast.success('User account updated!');
  };

  const handleDeleteUser = (userToDelete) => {
    if (userToDelete.id === 'admin') {
      toast.error('Cannot delete primary admin account');
      return;
    }
    if (confirm(`Delete user "${userToDelete.name}"?`)) {
      const updated = users.filter(u => u.id !== userToDelete.id);
      setUsers(updated);
      saveUsers(updated);
      toast.success('User deleted!');
    }
  };

  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.id.trim() || !newUser.name.trim() || !newUser.password.trim()) {
      toast.error('Fill all fields');
      return;
    }
    if (users.some(u => u.id.toLowerCase() === newUser.id.trim().toLowerCase())) {
      toast.error('User ID already exists');
      return;
    }

    const updated = [...users, { ...newUser, id: newUser.id.trim(), name: newUser.name.trim(), password: newUser.password.trim(), accessPages: [] }];
    setUsers(updated);
    saveUsers(updated);
    setNewUser({ id: '', name: '', password: '', role: 'USER' });
    setShowAddUser(false);
    toast.success('User account created!');
  };

  const inputCls = "block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all";
  const selectCls = "block w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Administration Settings</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Settings Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Configure staff authorization, roles, billing rates, and variables.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Global Sourcing Configuration */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Settings2 size={16} className="text-indigo-650" />
            Sourcing Variables
          </h3>
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg Handling Siding Rate (₹/MT)</label>
              <input
                type="number"
                value={handlingRate}
                onChange={e => setHandlingRate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Commission (₹/MT)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={e => setCommissionRate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Government TCS Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={tcsRate}
                onChange={e => setTcsRate(e.target.value)}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-605 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            >
              <Save size={14} /> Save Variables
            </button>
          </form>
        </div>

        {/* User Account Controls */}
        <div className="lg:col-span-2 space-y-4">
          {showAddUser && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-indigo-600" />
                Register New User
              </h3>
              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Username / ID</label>
                    <input
                      type="text"
                      value={newUser.id}
                      onChange={e => setNewUser(p => ({ ...p, id: e.target.value }))}
                      placeholder="e.g. rohit_s"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Rohit Sharma"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}
                      className={selectCls}
                    >
                      <option value="USER">USER — Standard Access</option>
                      <option value="ADMIN">ADMIN — Full Access</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Save size={13} />Save User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-650" />
                <h3 className="text-sm font-bold text-slate-800">Active Accounts ({users.length})</h3>
              </div>
              {!showAddUser && (
                <button
                  onClick={() => setShowAddUser(true)}
                  className="px-4 py-2 bg-indigo-605 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition shadow-sm"
                >
                  <UserPlus size={13} /> Add User Account
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['SN', 'Name', 'Username', 'Role', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {users.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      {editingUserId === user.id ? (
                        <>
                          <td className="px-5 py-3 text-slate-550">{idx + 1}</td>
                          <td className="px-5 py-3">
                            <input
                              type="text"
                              value={editingUser.name}
                              onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 w-full font-bold"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <input
                              type="text"
                              value={editingUser.id}
                              disabled
                              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 w-full text-slate-400 font-mono"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <select
                              value={editingUser.role}
                              onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer"
                            >
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={handleSaveUser}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingUserId(null); setEditingUser(null); }}
                                className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-[10px] font-semibold"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-5 py-3.5 text-slate-400">{idx + 1}</td>
                          <td className="px-5 py-3.5 text-slate-900 font-bold">{user.name}</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500">{user.id}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            }`}>{user.role}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => { setEditingUserId(user.id); setEditingUser({ ...user }); }}
                                className="p-1.5 text-slate-400 hover:text-indigo-650 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
