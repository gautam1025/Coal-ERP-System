import { useState, useEffect } from 'react';
import { ArrowRight, BadgeIndianRupee, CalendarClock, CircleCheckBig, Clock3, FileText, Fuel, Hammer, PackageSearch, RefreshCw, Boxes, ClipboardList } from 'lucide-react';
import MetricCard from '../../components/MetricCard';
import { getWorkflowData, WORKFLOW_STAGES } from '../../data/workflowStore';

const workflowStyles = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse',
  warning: 'bg-slate-50 text-slate-450 border-slate-200'
};

function StatusPill({ status, children }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${workflowStyles[status] || workflowStyles.active}`}>{children}</span>;
}

export default function Dashboard() {
  const [lot, setLot] = useState(null);

  useEffect(() => {
    const lots = getWorkflowData();
    const activeLot = lots.find(l => l.id === 'LOT-01') || lots[0];
    setLot(activeLot);
  }, []);

  if (!lot) {
    return <div className="text-xs text-slate-400 p-8 text-center">Loading dashboard metrics...</div>;
  }

  // Calculate dynamic stats from local storage data
  const purchasedQty = Number(lot.quantity) || 0;
  const liftedQty = Number(lot.dispatchQty) || 0;
  const pendingQty = Math.max(0, purchasedQty - liftedQty);
  const netProfit = Number(lot.profitAmount) || 0;
  const saleValue = Number(lot.invoiceValue) || (liftedQty * (Number(lot.salesPrice) || 4800));
  const govtCost = Number(lot.paymentAmount) || 0;
  const totalCost = Number(lot.expenses) || (govtCost + (Number(lot.transportPayable) || 0) + (Number(lot.commissionPayable) || 0));

  // Build dynamic workflow steps
  const steps = WORKFLOW_STAGES.slice(0, 12).map((stage, idx) => {
    const state = lot.stages[stage.id];
    let pillStatus = 'warning';
    if (state === 'history') pillStatus = 'completed';
    else if (state === 'pending') pillStatus = 'active';

    return {
      title: stage.title,
      status: pillStatus
    };
  });

  const activityNotes = [
    lot.stages['delivery-order'] === 'history' 
      ? `DO approved: DO Number ${lot.doNo || '—'} is active.`
      : `DO Siding approval is in progress.`,
    lot.stages['truck-dispatch'] === 'history'
      ? `Truck dispatch: ${liftedQty.toLocaleString()} MT loaded via ${lot.transporter || '—'}.`
      : `Dispatch lines are awaiting lifter allocation.`,
    lot.stages['invoice'] === 'history'
      ? `Invoice ${lot.invoiceNo || '—'} value of ₹${(lot.invoiceValue || 0).toLocaleString()} sent to customer.`
      : `Invoice billing remains pending.`,
    lot.stages['collection'] === 'history'
      ? `Payment collection of ₹${(lot.collectedAmount || 0).toLocaleString()} deposited.`
      : `Outstanding customer payment collection is tracked.`
  ];

  const alertNotes = [
    lot.stages['delivery-order'] === 'history' ? `DO active and valid till ${lot.doExpiry || '—'}` : 'Delivery Order is awaiting submission',
    lot.stages['government-payment'] === 'history' ? `Government payment confirmed (UTR: ${lot.utr || '—'})` : 'Government Payment Advice pending',
    lot.outstanding > 0 ? `Customer outstanding collection: ₹${lot.outstanding.toLocaleString()}` : 'Collection balances cleared',
    lot.stages['transport'] === 'history' ? `Transport billing TB-SHREE-01 settled` : 'Transport payable awaiting payment check'
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Coal Deal Management ERP</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Coal Trading Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-650 font-medium">
              A single-deal demo that traces the full lifecycle from auction to profitability for {lot.dealId}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusPill status="completed">Firm: {lot.firm}</StatusPill>
            <StatusPill status="active">Source: {lot.source}</StatusPill>
            <StatusPill status="warning">Deal ID: {lot.dealId}</StatusPill>
          </div>
        </div>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Coal Purchased" value={`${purchasedQty.toLocaleString()} MT`} icon={Boxes} description="Consolidated bid volume" gradient="from-indigo-500 to-blue-500" />
        <MetricCard title="Total Coal Lifted" value={`${liftedQty.toLocaleString()} MT`} icon={Hammer} description="Actual rail/road lifting" gradient="from-emerald-500 to-teal-500" />
        <MetricCard title="Pending Quantity" value={`${pendingQty.toLocaleString()} MT`} icon={PackageSearch} description="DO balance open" gradient="from-amber-500 to-orange-500" />
        <MetricCard title="Consolidated Profit" value={`₹${(netProfit / 10000000).toFixed(2)} Cr`} icon={BadgeIndianRupee} description="Dynamic deal profitability" gradient="from-purple-500 to-indigo-600" />
      </div>

      {/* Main Grid: Steps & Alerts */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Deal Progress Checklist */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Deal Workflow Progress</h2>
              <p className="mt-1 text-xs text-slate-400">Trace the dynamic lifecycle stages sharing the same Deal ID.</p>
            </div>
            <ArrowRight className="text-slate-400" size={18} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-150 p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {index + 1}</p>
                    <h3 className="mt-1 text-xs font-bold text-slate-900 truncate max-w-[130px]">{step.title}</h3>
                  </div>
                  <StatusPill status={step.status}>{step.status}</StatusPill>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 font-semibold">Stage tracking for {lot.dealId}.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Alerts Siding */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                <p className="mt-1 text-xs text-slate-400">Operational updates from the deal timeline.</p>
              </div>
              <RefreshCw className="text-slate-400" size={18} />
            </div>

            <div className="mt-5 space-y-3.5">
              {activityNotes.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-4 text-xs font-semibold text-slate-650 border border-slate-100/50">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Critical Warnings Alert Block */}
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Clock3 size={15} />
              <span className="text-xs font-bold">Critical Alerts</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs font-semibold text-amber-900">
              {alertNotes.map((alert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Margins & Siding Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profit Margin Cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Profit Snapshot</h2>
              <p className="mt-1 text-xs text-slate-400">Expected versus actual margin for the current deal.</p>
            </div>
            <BadgeIndianRupee className="text-slate-400" size={18} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sale Value</p>
              <p className="mt-2 text-lg font-bold text-slate-900">₹{(saleValue / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cost</p>
              <p className="mt-2 text-lg font-bold text-slate-900">₹{(totalCost / 10000000).toFixed(2)} Cr</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-650">Net Profit</p>
              <p className="mt-2 text-lg font-bold text-emerald-700">₹{(netProfit / 10000000).toFixed(2)} Cr</p>
            </div>
          </div>
        </div>

        {/* Identity Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Core Deal Identity</h2>
              <p className="mt-1 text-xs text-slate-400">One deal, one traceable history.</p>
            </div>
            <CircleCheckBig className="text-emerald-500" size={18} />
          </div>

          <div className="mt-5 space-y-3 text-xs font-semibold text-slate-700">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"><span>Firm</span><span className="font-bold text-slate-900">{lot.firm}</span></div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"><span>Mine Siding</span><span className="font-bold text-slate-900">{lot.mine}</span></div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"><span>Coal Quality Grade</span><span className="font-bold text-slate-900">{lot.grade}</span></div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-100"><span>DO Balance Tonnage</span><span className="font-bold text-slate-900">{pendingQty.toLocaleString()} MT</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
