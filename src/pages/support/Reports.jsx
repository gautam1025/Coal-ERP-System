import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, Landmark, Percent } from 'lucide-react';
import MetricCard from '../../components/MetricCard';

const REPORT_SECTIONS = [
  { id: 'summary', label: 'Deal Financials' },
  { id: 'lifting', label: 'Logistics Performance' },
];

export default function Reports() {
  const [activeSec, setActiveSec] = useState('summary');

  return (
    <div className="space-y-6">
      {/* Metric Summaries */}

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          title="Total Deal Value"
          value="₹6.22 Cr"
          icon={DollarSign}
          description="Consolidated sales forecast"
          gradient="from-indigo-500 to-blue-500"
        />
        <MetricCard
          title="Consolidated Net Profit"
          value="₹1.39 Cr"
          icon={TrendingUp}
          description="Estimated deal profitability margin"
          gradient="from-emerald-500 to-teal-500"
        />
        <MetricCard
          title="Average Profit Margin"
          value="22.3%"
          icon={Percent}
          description="Net return across all operations"
          gradient="from-sky-500 to-cyan-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100/70 rounded-2xl p-1 w-full sm:w-auto">
        {REPORT_SECTIONS.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSec(sec.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-initial justify-center ${
              activeSec === sec.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Report View Panel */}
      {activeSec === 'summary' && (
        <div className="space-y-6 animate-in fade-in duration-250">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Firm-wise Profit Summary</h2>
              <p className="text-xs text-slate-400 mt-0.5">Estimated performance numbers comparing both firms.</p>
            </div>

            {/* Visual Progress Chart comparing Firms */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>ASAK Coal Pvt. Ltd. (DEAL-2026-001)</span>
                  <span className="text-indigo-600">₹1,12,00,000 Profit</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-indigo-650 h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Cost: ₹3.08 Cr</span>
                  <span>Revenue: ₹4.20 Cr (26.7% Margin)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Jai Bhole Enterprises (Third Party Handling)</span>
                  <span className="text-indigo-600">₹27,30,000 Profit</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-indigo-650 h-3 rounded-full" style={{ width: '19.5%' }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Cost: ₹1.15 Cr</span>
                  <span>Revenue: ₹1.42 Cr (19.2% Margin)</span>
                </div>
              </div>
            </div>

            {/* Table detailed view */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {['Firm Name', 'Sourced Qty', 'Lifted Qty', 'Total Cost', 'Expected Profit', 'Net Margin'].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-slate-900">ASAK Coal Pvt. Ltd.</td>
                    <td className="px-5 py-4">10,000 MT</td>
                    <td className="px-5 py-4 text-indigo-600">6,750 MT</td>
                    <td className="px-5 py-4 text-slate-600">₹3,08,00,000</td>
                    <td className="px-5 py-4 text-emerald-650 font-bold">₹1,12,00,000</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold">26.7%</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-slate-900">Jai Bhole Enterprises</td>
                    <td className="px-5 py-4">3,000 MT</td>
                    <td className="px-5 py-4 text-indigo-600">1,800 MT</td>
                    <td className="px-5 py-4 text-slate-600">₹1,15,20,000</td>
                    <td className="px-5 py-4 text-emerald-650 font-bold">₹27,30,000</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold">19.2%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSec === 'lifting' && (
        <div className="space-y-6 animate-in fade-in duration-250">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Lifting Speed Analysis</h2>
              <p className="text-xs text-slate-400 mt-0.5">Average delivery order lifting speeds against validity deadlines.</p>
            </div>

            {/* Performance charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-slate-150 rounded-xl p-5 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">DO Quantity Fulfillment</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>DO-SECL-001 (Kusmunda)</span>
                      <span>67.5% Lifted</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '67.5%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">6,750 MT lifted / 3,250 MT pending (Validity: 45 days)</p>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>DO-SECL-002 (Kusmunda)</span>
                      <span>60.0% Lifted</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">1,800 MT lifted / 1,200 MT pending (Validity: 45 days)</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-150 rounded-xl p-5 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Lifter Speed Rates</h3>
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">ABC Lifter (Kusmunda)</span>
                    <span className="text-indigo-600 font-bold">1,200 MT/day</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">XYZ Handling</span>
                    <span className="text-indigo-600 font-bold">1,000 MT/day</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Both lifters operate high-speed mechanical loader tracks at the Kusmunda siding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
