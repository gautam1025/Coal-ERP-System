import { useState } from 'react';
import {
  X, AlertCircle, CalendarDays, FileText, CheckSquare, Calculator,
  Truck, Receipt, MapPin, Clock, User, Phone, Upload, Check, ToggleLeft,
} from 'lucide-react';

const INPUT_CLS = (hasErr) =>
  `block w-full text-xs bg-slate-50 border ${
    hasErr ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
  } rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all`;

const READONLY_CLS =
  'bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-semibold min-h-[38px] flex items-center';

const Label = ({ icon: Icon, text, required, isViewOnly }) => (
  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
    {Icon && <Icon size={10} />}
    {text}
    {required && !isViewOnly && <span className="text-rose-500 ml-0.5">*</span>}
  </label>
);

const Err = ({ msg }) =>
  msg ? (
    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1">
      <AlertCircle size={10} /> {msg}
    </span>
  ) : null;

const SectionTitle = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
    <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
      <Icon size={12} />
    </div>
    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{text}</h3>
  </div>
);

/* ── small helpers ── */
const Field = ({ label, icon: Icon, name, required, children, isViewOnly, errors }) => (
  <div>
    <Label icon={Icon} text={label} required={required} isViewOnly={isViewOnly} />
    {children}
    <Err msg={errors[name]} />
  </div>
);

const ReadonlyOrInput = ({ name, type = 'text', placeholder, required, isViewOnly, formData, handleChange, errors }) => (
  isViewOnly ? (
    <div className={READONLY_CLS}>{formData[name] || '—'}</div>
  ) : (
    <input
      type={type}
      placeholder={placeholder}
      value={formData[name] || ''}
      onChange={e => handleChange(name, type === 'number' ? Number(e.target.value) : e.target.value)}
      className={INPUT_CLS(errors[name])}
    />
  )
);

const FileUploadField = ({ name, isViewOnly, formData, uploadingField, uploadProgress, handleFileUpload }) => {
  if (isViewOnly) {
    return <div className={READONLY_CLS}>{formData[name] || '—'}</div>;
  }
  if (uploadingField === name) {
    return (
      <div className="bg-slate-50 border border-indigo-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-indigo-600">Uploading: {uploadProgress}%</span>
        <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-600 h-1.5 transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
        </div>
      </div>
    );
  }
  if (formData[name]) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-emerald-700 truncate max-w-[80%]">{formData[name]}</span>
        <Check size={14} className="text-emerald-600 shrink-0" />
      </div>
    );
  }
  return (
    <div className="relative group">
      <input type="file" onChange={e => handleFileUpload(name, e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border border-slate-200 group-hover:border-indigo-400 rounded-xl text-xs text-slate-400 transition-all">
        <span>Click to upload file</span>
        <Upload size={14} className="text-slate-400 shrink-0" />
      </div>
    </div>
  );
};

export default function WorkOrderProcessModal({ stage, lot, allPendingLots, onSubmit, onClose }) {
  const isViewOnly = !onSubmit;

  const [formData, setFormData] = useState({
    doPoNumber: lot?.doPoNumber || '',
    startDate: lot?.startDate || '',
    targetCompletionDate: lot?.targetCompletionDate || '',
    terms: lot?.terms || '',
    // Billing
    billNo: lot?.billNo || '',
    dateOfBill: lot?.dateOfBill || '',
    areaLifting: lot?.areaLifting || '',
    leadTimeDays: lot?.leadTimeDays || '',
    materialsBillingQty: lot?.materialsBillingQty || '',
    // Transport
    truckNo: lot?.truckNo || '',
    driverNo: lot?.driverNo || '',
    transporterName: lot?.transporterName || '',
    typeOfTransportRate: lot?.typeOfTransportRate || 'Per MT',
    transportingPerMtRate: lot?.transportingPerMtRate || '',
    transportationTotalAmount: lot?.transportationTotalAmount || '',
    // Documents
    hasBilty: lot?.hasBilty ?? false,
    billImage: lot?.billImage || '',
    testingCertificate: lot?.testingCertificate || '',
  });

  const [errors, setErrors] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [rowData, setRowData] = useState(() =>
    (allPendingLots || []).map(l => ({
      lotId: l.id,
      selected: l.id === lot.id,
      liftQty: l.liftQty ?? 0,
    }))
  );

  /* ── handlers ── */
  const handleChange = (key, val) => {
    setFormData(prev => {
      const next = { ...prev, [key]: val };
      // Auto-calculate total transport amount
      if (key === 'transportingPerMtRate' || key === 'materialsBillingQty') {
        const rate = Number(key === 'transportingPerMtRate' ? val : prev.transportingPerMtRate) || 0;
        const qty  = Number(key === 'materialsBillingQty'  ? val : prev.materialsBillingQty)  || 0;
        next.transportationTotalAmount = rate * qty || '';
      }
      return next;
    });
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleRowToggle = (lotId) => {
    setRowData(prev => prev.map(r => r.lotId === lotId ? { ...r, selected: !r.selected } : r));
  };

  const handleLiftQtyChange = (lotId, val) => {
    const found = (allPendingLots || []).find(l => l.id === lotId);
    const max = found?.quantity ?? Infinity;
    const parsed = Math.min(Math.max(0, Number(val) || 0), max);
    setRowData(prev => prev.map(r => r.lotId === lotId ? { ...r, liftQty: parsed } : r));
  };

  const handleSelectAll = () => {
    const allSel = rowData.every(r => r.selected);
    setRowData(prev => prev.map(r => ({ ...r, selected: !allSel })));
  };

  const handleFileUpload = (key, files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setUploadingField(key);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            handleChange(key, file.name);
            setUploadingField(null);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.targetCompletionDate) newErrors.targetCompletionDate = 'Target Completion Date is required';
    if (!formData.terms.trim()) newErrors.terms = 'Terms is required';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const selectedRows = rowData.filter(r => r.selected);
    onSubmit({
      ...formData,
      selectedLotIds: selectedRows.map(r => r.lotId),
      liftQtyMap: Object.fromEntries(selectedRows.map(r => [r.lotId, r.liftQty])),
    });
  };

  /* ── derived ── */
  const allSelected  = rowData.length > 0 && rowData.every(r => r.selected);
  const someSelected = rowData.some(r => r.selected);
  const selectedTotalQty = (allPendingLots || [])
    .filter(l => rowData.find(r => r.lotId === l.id)?.selected)
    .reduce((s, l) => s + (l.quantity || 0), 0);
  const selectedTotalLift = rowData.filter(r => r.selected).reduce((s, r) => s + (r.liftQty || 0), 0);
  const selectedTotalPending = selectedTotalQty - selectedTotalLift;

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl flex flex-col max-h-[94vh]"
        style={{ animation: 'fadeInZoom 0.18s ease' }}
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${
              isViewOnly ? 'text-slate-500 bg-slate-100' : 'text-indigo-600 bg-indigo-50'
            }`}>
              {isViewOnly ? 'View Details' : 'Process Action'}
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1.5">
              Work Order {isViewOnly ? 'Details' : 'Processing'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* ─── Section 1: Lot Selection Table (shown first) ─── */}
          <div>
            <SectionTitle icon={CheckSquare} text={isViewOnly ? 'Lots in this Work Order' : 'Select Lots to Process'} />

            {!isViewOnly && (
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {someSelected && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full">
                      {rowData.filter(r => r.selected).length} selected
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSelectAll}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50"
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 w-10">
                        {!isViewOnly && (
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                            onChange={handleSelectAll}
                            className="w-3.5 h-3.5 accent-indigo-600 cursor-pointer"
                          />
                        )}
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lot No</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Work Order No</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Lifter</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Total Qty (MT)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">
                        Lift Qty (MT)
                        {!isViewOnly && <span className="ml-1 text-indigo-400 font-normal normal-case tracking-normal">(editable)</span>}
                      </th>
                      <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Calculator size={10} className="text-slate-400" /> Pending Qty (MT)
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(allPendingLots || []).length > 0 ? (
                      (allPendingLots || []).map((pendingLot, idx) => {
                        const row        = rowData.find(r => r.lotId === pendingLot.id);
                        const isSelected = row?.selected || false;
                        const currentLift = row?.liftQty ?? pendingLot.liftQty ?? 0;
                        const totalQty   = pendingLot.quantity || 0;
                        const pendingQty = Math.max(0, totalQty - currentLift);

                        return (
                          <tr
                            key={pendingLot.id || idx}
                            onClick={() => !isViewOnly && handleRowToggle(pendingLot.id)}
                            className={`transition-colors ${!isViewOnly ? 'cursor-pointer' : ''} ${
                              isSelected ? 'bg-indigo-50/60' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                              {!isViewOnly && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleRowToggle(pendingLot.id)}
                                  className="w-3.5 h-3.5 accent-indigo-600 cursor-pointer"
                                />
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs font-bold text-slate-900 whitespace-nowrap">{pendingLot.lotNo}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-indigo-700 whitespace-nowrap">{pendingLot.woNo || '—'}</td>
                            <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{pendingLot.lifter || '—'}</td>
                            <td className="px-4 py-3 text-xs font-semibold text-slate-800 whitespace-nowrap text-right">{totalQty.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                              {isViewOnly ? (
                                <span className="text-xs font-semibold text-emerald-700">{currentLift.toLocaleString()}</span>
                              ) : (
                                <input
                                  type="number"
                                  min={0}
                                  max={totalQty}
                                  value={currentLift}
                                  onChange={e => handleLiftQtyChange(pendingLot.id, e.target.value)}
                                  className={`w-28 text-xs text-right font-semibold border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all ${
                                    isSelected ? 'bg-white border-indigo-300 text-indigo-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                                  }`}
                                />
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[52px] ${
                                pendingQty === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}>
                                {pendingQty.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-xs font-medium">
                          No pending lots found
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {(allPendingLots || []).length > 0 && (
                    <tfoot>
                      <tr className="bg-gradient-to-r from-slate-50 to-indigo-50/30 border-t-2 border-slate-200">
                        <td colSpan={4} className="px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {isViewOnly ? 'Total' : `Totals (${rowData.filter(r => r.selected).length} selected)`}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-bold text-slate-800 text-right whitespace-nowrap">
                          {selectedTotalQty.toLocaleString()} MT
                        </td>
                        <td className="px-4 py-2.5 text-xs font-bold text-emerald-700 text-right whitespace-nowrap">
                          {selectedTotalLift.toLocaleString()} MT
                        </td>
                        <td className="px-4 py-2.5 text-xs font-bold text-amber-700 text-right whitespace-nowrap">
                          {Math.max(0, selectedTotalPending).toLocaleString()} MT
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>

          {/* ─── Section 2: Core Details ─── */}
          <div>
            <SectionTitle icon={FileText} text="Work Order Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Field label="DO/PO Number" icon={FileText} name="doPoNumber" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="doPoNumber" placeholder="e.g. DO-2026-001"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Start Date" icon={CalendarDays} name="startDate" required isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly
                  ? <div className={READONLY_CLS}>{formData.startDate || '—'}</div>
                  : <input type="date" value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)} className={INPUT_CLS(errors.startDate)} />}
                <Err msg={errors.startDate} />
              </Field>

              <Field label="Target Completion Date" icon={CalendarDays} name="targetCompletionDate" required isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly
                  ? <div className={READONLY_CLS}>{formData.targetCompletionDate || '—'}</div>
                  : <input type="date" value={formData.targetCompletionDate} onChange={e => handleChange('targetCompletionDate', e.target.value)} className={INPUT_CLS(errors.targetCompletionDate)} />}
                <Err msg={errors.targetCompletionDate} />
              </Field>

              <Field label="Terms" icon={FileText} name="terms" required isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly
                  ? <div className={READONLY_CLS}>{formData.terms || '—'}</div>
                  : <input type="text" placeholder="e.g. Net 30 / Ex-mine / FOB" value={formData.terms} onChange={e => handleChange('terms', e.target.value)} className={INPUT_CLS(errors.terms)} />}
                <Err msg={errors.terms} />
              </Field>
            </div>
          </div>

          {/* ─── Section 2: Billing Details ─── */}
          <div>
            <SectionTitle icon={Receipt} text="Billing Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Field label="Bill No." icon={Receipt} name="billNo" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="billNo" placeholder="e.g. BILL-2026-001"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Date of Bill" icon={CalendarDays} name="dateOfBill" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="dateOfBill" type="date"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Area Lifting" icon={MapPin} name="areaLifting" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="areaLifting" placeholder="e.g. Mine Area / Depot"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Lead Time (Days)" icon={Clock} name="leadTimeDays" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="leadTimeDays" type="number" placeholder="e.g. 7"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Materials Billing Quantity (MT)" icon={Calculator} name="materialsBillingQty" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="materialsBillingQty" type="number" placeholder="e.g. 500"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

            </div>
          </div>

          {/* ─── Section 3: Transport Details ─── */}
          <div>
            <SectionTitle icon={Truck} text="Transport Details" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <Field label="Truck No." icon={Truck} name="truckNo" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="truckNo" placeholder="e.g. MH-12-AB-1234"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Driver No." icon={Phone} name="driverNo" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="driverNo" placeholder="e.g. +91 98765 43210"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Transporter Name" icon={User} name="transporterName" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="transporterName" placeholder="e.g. Shree Transport"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Type of Transporting Rate" icon={FileText} name="typeOfTransportRate" isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly ? (
                  <div className={READONLY_CLS}>{formData.typeOfTransportRate || '—'}</div>
                ) : (
                  <select
                    value={formData.typeOfTransportRate}
                    onChange={e => handleChange('typeOfTransportRate', e.target.value)}
                    className={INPUT_CLS(false)}
                  >
                    <option value="Per MT">Per MT</option>
                    <option value="Per Trip">Per Trip</option>
                    <option value="Lump Sum">Lump Sum</option>
                    <option value="Per KM">Per KM</option>
                  </select>
                )}
              </Field>

              <Field label="Transporting Per MT Rate (₹)" icon={Calculator} name="transportingPerMtRate" isViewOnly={isViewOnly} errors={errors}>
                <ReadonlyOrInput name="transportingPerMtRate" type="number" placeholder="e.g. 250"  isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />
              </Field>

              <Field label="Transportation Total Amount (₹)" icon={Calculator} name="transportationTotalAmount" isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly ? (
                  <div className={READONLY_CLS}>
                    {formData.transportationTotalAmount
                      ? `₹ ${Number(formData.transportationTotalAmount).toLocaleString()}`
                      : '—'}
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2.5 text-xs font-bold text-indigo-800 min-h-[38px] flex items-center">
                    {formData.transportationTotalAmount
                      ? `₹ ${Number(formData.transportationTotalAmount).toLocaleString()}`
                      : <span className="text-slate-400 font-normal">Auto-calculated</span>}
                  </div>
                )}
              </Field>

            </div>
          </div>

          {/* ─── Section 4: Documents ─── */}
          <div>
            <SectionTitle icon={Upload} text="Documents & Verification" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Has Bilty toggle */}
              <Field label="Has Bilty?" icon={FileText} name="hasBilty" isViewOnly={isViewOnly} errors={errors}>
                {isViewOnly ? (
                  <div className={READONLY_CLS}>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${formData.hasBilty ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {formData.hasBilty ? 'Yes' : 'No'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleChange('hasBilty', !formData.hasBilty)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.hasBilty
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>{formData.hasBilty ? 'Yes — Bilty Available' : 'No — Bilty Not Available'}</span>
                    <div className={`w-9 h-5 rounded-full transition-all relative ${formData.hasBilty ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.hasBilty ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </button>
                )}
              </Field>

              <Field label="Upload Bill Image" icon={Upload} name="billImage" isViewOnly={isViewOnly} errors={errors}>
                <FileUploadField name="billImage"  isViewOnly={isViewOnly} formData={formData} uploadingField={uploadingField} uploadProgress={uploadProgress} handleFileUpload={handleFileUpload} />
              </Field>

              <Field label="Upload Testing Certificate" icon={Upload} name="testingCertificate" isViewOnly={isViewOnly} errors={errors}>
                <FileUploadField name="testingCertificate"  isViewOnly={isViewOnly} formData={formData} uploadingField={uploadingField} uploadProgress={uploadProgress} handleFileUpload={handleFileUpload} />
              </Field>

            </div>
          </div>

        </div>{/* end scrollable body */}

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between rounded-b-2xl shrink-0">
          {!isViewOnly && someSelected ? (
            <p className="text-[10px] text-slate-400 font-medium">
              {rowData.filter(r => r.selected).length} lot(s) will be processed
            </p>
          ) : (
            <span />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-all"
            >
              {isViewOnly ? 'Close' : 'Cancel'}
            </button>

            {!isViewOnly && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!someSelected}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save &amp; Process
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInZoom {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
