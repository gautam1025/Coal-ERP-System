import { useState, useEffect } from 'react';
import { ArrowRight, BadgeIndianRupee, CircleDashed, ClipboardList, Clock3, FileText, GitBranch, HandCoins, Truck } from 'lucide-react';
import MetricCard from '../../components/MetricCard';
import { getWorkflowData, WORKFLOW_STAGES } from '../../data/workflowStore';

const statusStyles = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  active: 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse',
  warning: 'bg-slate-50 text-slate-450 border-slate-200'
};

function StatusPill({ status, children }) {
  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[status] || statusStyles.active}`}>{children}</span>;
}

export default function Deal360() {
  const [lot, setLot] = useState(null);

  useEffect(() => {
    const lots = getWorkflowData();
    const activeLot = lots.find(l => l.id === 'LOT-01') || lots[0];
    setLot(activeLot);
  }, []);

  if (!lot) {
    return <div className="text-xs text-slate-400 p-8 text-center">Loading deal data...</div>;
  }

  // Calculate stats from dynamic lot details
  const purchasedQty = Number(lot.quantity) || 0;
  const liftedQty = Number(lot.dispatchQty) || 0;
  const pendingQty = Math.max(0, purchasedQty - liftedQty);
  const netProfit = Number(lot.profitAmount) || 0;
  const saleValue = Number(lot.invoiceValue) || (liftedQty * (Number(lot.salesPrice) || 4800));
  const govtCost = Number(lot.paymentAmount) || 0;
  const outstandingCollection = Number(lot.outstanding) || 0;
  
  const marginPercent = saleValue > 0 ? (netProfit / saleValue) * 100 : 0;

  // Build dynamic timeline steps
  const timelineSteps = WORKFLOW_STAGES.map((stage, idx) => {
    const state = lot.stages[stage.id];
    let pillStatus = 'warning';
    let detailText = 'Awaiting preceding workflow operations.';

    if (state === 'history') {
      pillStatus = 'completed';
      if (stage.id === 'auction') detailText = `Auction No: ${lot.auctionNo || 'AUC-2026-001'} registered on ${lot.notificationDate || '—'}.`;
      else if (stage.id === 'emd') detailText = `₹${(lot.emdAmount || 0).toLocaleString()} EMD paid via Bank: ${lot.bank || '—'} (UTR: ${lot.utr || '—'}).`;
      else if (stage.id === 'bid') detailText = `Bid Won: ${purchasedQty.toLocaleString()} MT at ₹${(lot.bidRate || 0).toLocaleString()}/MT.`;
      else if (stage.id === 'sale-letter') detailText = `Sale Letter No: ${lot.saleLetterNo || '—'} registered on ${lot.saleLetterDate || '—'}.`;
      else if (stage.id === 'payment-advice') detailText = `Advice No: ${lot.paymentAdviceNo || '—'} gross amount: ₹${(lot.paymentAmount || 0).toLocaleString()} confirmed.`;
      else if (stage.id === 'government-payment') detailText = `Government Payment of ₹${(lot.paymentAmount || 0).toLocaleString()} paid (UTR: ${lot.utr || '—'}).`;
      else if (stage.id === 'application-submission') detailText = `Application receipt ${lot.submissionNo || '—'} acknowledged by office.`;
      else if (stage.id === 'delivery-order') detailText = `DO ${lot.doNo || '—'} valid till ${lot.doExpiry || '—'}.`;
      else if (stage.id === 'lifter-management') detailText = `Assigned Lifter: ${lot.lifter || '—'} (handling work order ${lot.woNo || '—'}).`;
      else if (stage.id === 'lifting-work-order') detailText = `Lifting work order issued at speed of ${lot.liftingSpeed || '—'}.`;
      else if (stage.id === 'truck-dispatch') detailText = `Dispatched ${(lot.dispatchQty || 0).toLocaleString()} MT via ${lot.transporter || '—'}.`;
      else if (stage.id === 'customer-order') detailText = `Sales order for ${lot.customer || '—'} at rate ₹${(lot.salesPrice || 0).toLocaleString()}/MT.`;
      else if (stage.id === 'do-allocation') detailText = `DO Siding allocation: ${(lot.allocatedQty || 0).toLocaleString()} MT.`;
      else if (stage.id === 'invoice') detailText = `Invoice ${lot.invoiceNo || '—'} value: ₹${(lot.invoiceValue || 0).toLocaleString()} generated.`;
      else if (stage.id === 'collection') detailText = `Collected: ₹${(lot.collectedAmount || 0).toLocaleString()} | Outstanding: ₹${outstandingCollection.toLocaleString()}.`;
      else if (stage.id === 'transport') detailText = `Transport payment bill ${lot.transportBillNo || '—'} value ₹${(lot.transportPayable || 0).toLocaleString()} settled.`;
      else if (stage.id === 'commission') detailText = `Commission of ₹${(lot.commissionPayable || 0).toLocaleString()} settled with broker ${lot.broker || '—'}.`;
      else if (stage.id === 'refund') detailText = `Lapse Refund claim ${lot.claimNo || '—'} status: ${lot.refundStatus || '—'}.`;
      else if (stage.id === 'profitability') detailText = `Profitability settled. Profit amount: ₹${netProfit.toLocaleString()}.`;
      else detailText = `Workflow operation successfully archived in ledger.`;
    } else if (state === 'pending') {
      pillStatus = 'active';
      detailText = `Active checkpoint. Access "Purchase Workflow" menu in sidebar under "${stage.title}" to submit form.`;
    }

    return {
      step: stage.title,
      status: pillStatus,
      detail: detailText
    };
  });

  // Re-build standard lists from lot references
  const documents = [
    lot.notificationDoc && 'Auction Notice File',
    lot.paymentReceiptDoc && 'EMD Payment Receipt',
    lot.saleLetterDoc && 'Sale Letter Copy',
    lot.adviceDoc && 'Payment Advice File',
    lot.paymentProofDoc && 'Government Payment Proof',
    lot.receiptDoc && 'Application Acknowledgment',
    lot.doDoc && 'DO Siding Copy',
    lot.woDoc && 'Lifting Work Order Document',
    lot.dispatchDoc && 'Truck Dispatch Log',
    lot.invoiceDoc && 'Customer Invoice PDF',
    lot.transportDoc && 'Transport Bill Copy'
  ].filter(Boolean);

  // If no files uploaded yet, render fallback defaults
  const docList = documents.length > 0 ? documents : [
    'Auction Notice (Draft)',
    'EMD Bank Receipt',
    'Approved Sale Letter',
    'DO Siding Copy',
    'Customer Invoice Copy'
  ];

  const tasks = [
    { label: 'Confirm government payment advice parameters', done: lot.stages['payment-advice'] === 'history' },
    { label: 'Submit application packet to SECL department', done: lot.stages['application-submission'] === 'history' },
    { label: 'Generate lifting work order for assigned lifter', done: lot.stages['lifting-work-order'] === 'history' },
    { label: 'Disburse truck dispatches and record mine weight', done: lot.stages['truck-dispatch'] === 'history' },
    { label: 'Collect customer balance payment and deposit broker fees', done: lot.stages['collection'] === 'history' }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-600">Deal 360 View</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{lot.dealId}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              This screen is the end-to-end control room for the coal deal lifecycle, from auction to profitability.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatusPill status="completed">Firm: {lot.firm}</StatusPill>
            <StatusPill status="active">Source: {lot.source}</StatusPill>
            <StatusPill status="warning">Mine: {lot.mine}</StatusPill>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Purchase Quantity" value={`${purchasedQty.toLocaleString()} MT`} icon={ClipboardList} description="Auction allocation" gradient="from-indigo-500 to-blue-500" />
        <MetricCard title="Lifted Quantity" value={`${liftedQty.toLocaleString()} MT`} icon={Truck} description="Truck-dispatched lifts" gradient="from-emerald-500 to-teal-500" />
        <MetricCard title="Pending Quantity" value={`${pendingQty.toLocaleString()} MT`} icon={CircleDashed} description="DO balance open" gradient="from-amber-500 to-orange-500" />
        <MetricCard title="Net Profit" value={`₹${(netProfit / 10000000).toFixed(2)} Cr`} icon={BadgeIndianRupee} description="Current estimate" gradient="from-purple-500 to-indigo-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        
        {/* Dynamic Workflow Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Progress Timeline</h2>
              <p className="mt-1 text-xs text-slate-400">Workflow state across every module that shares the same Deal ID.</p>
            </div>
            <GitBranch className="text-slate-400" size={18} />
          </div>

          <div className="mt-6 space-y-4">
            {timelineSteps.map((item, index) => (
              <div key={item.step} className="flex gap-4 rounded-xl border border-slate-150 p-4 hover:bg-slate-50/50 transition-colors">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{item.step}</h3>
                    <StatusPill status={item.status}>{item.status}</StatusPill>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 font-medium">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          
          {/* Sourcing Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Deal Summary</h2>
                <p className="mt-1 text-xs text-slate-400">One card per critical control area.</p>
              </div>
              <ArrowRight className="text-slate-400" size={18} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sale Value</p>
                <p className="mt-2 text-lg font-bold text-slate-900">₹{(saleValue / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Govt Payment</p>
                <p className="mt-2 text-lg font-bold text-slate-900">₹{(govtCost / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Collection Pending</p>
                <p className="mt-2 text-lg font-bold text-slate-900">₹{(outstandingCollection / 10000000).toFixed(2)} Cr</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-650">Net Margin</p>
                <p className="mt-2 text-lg font-bold text-emerald-700">{marginPercent.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Deal Documents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Documents Vault</h2>
                <p className="mt-1 text-xs text-slate-400">Every record stays attached to the deal.</p>
              </div>
              <FileText className="text-slate-400" size={18} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {docList.map((document) => (
                <span key={document} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-550 whitespace-nowrap">
                  {document}
                </span>
              ))}
            </div>
          </div>

          {/* Reminders / Tasks */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Open Tasks</h2>
                <p className="mt-1 text-xs text-slate-400">Reminders that keep the deal moving.</p>
              </div>
              <Clock3 className="text-slate-400" size={18} />
            </div>

            <ul className="mt-5 space-y-3 text-xs font-semibold text-slate-700">
              {tasks.map((task) => (
                <li key={task.label} className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
                  task.done ? 'bg-emerald-50/50 border-emerald-100 text-slate-500' : 'bg-slate-50 border-slate-100'
                }`}>
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[10px] ${
                    task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {task.done && '✓'}
                  </span>
                  <span className={task.done ? 'line-through' : ''}>{task.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Control Notes Footer */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Control Notes</h2>
            <p className="mt-1 text-xs text-slate-400">The deal shows the full lifecycle in one place, updated live from local storage.</p>
          </div>
          <HandCoins className="text-slate-400" size={18} />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Auction to Payment</p>
            <p className="mt-2 text-xs text-slate-550 leading-relaxed">EMD, bid, sale letter, and government payment values sync instantly on modal form submits.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operations</p>
            <p className="mt-2 text-xs text-slate-550 leading-relaxed">DO, lifter assignment, work order details, and truck loading dispatches are fully tracked.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Finance & margins</p>
            <p className="mt-2 text-xs text-slate-550 leading-relaxed">Invoices, collection receipts, transport balance freight, and broker commissions calculate net profitability margins.</p>
          </div>
        </div>
      </div>
    </div>
  );
}