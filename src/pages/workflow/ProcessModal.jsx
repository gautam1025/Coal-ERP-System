import { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, Calculator } from 'lucide-react';

export default function ProcessModal({ stage, lot, onSubmit, onClose }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [uploadingField, setUploadingField] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize form values from lot or set default
  useEffect(() => {
    const initial = {};
    stage.fields.forEach(field => {
      if (field.cumulative) {
        // Pre-fill cumulative fields from lot properties
        initial[field.key] = lot[field.key] || lot[field.fallbackKey] || '';
      } else if (field.type === 'select') {
        initial[field.key] = lot[field.key] || field.options[0];
      } else {
        initial[field.key] = lot[field.key] || '';
      }
    });

    // Handle stage 19 (Profitability) calculations auto-calculate
    if (stage.id === 'profitability') {
      const purchaseCost = Number(lot.paymentAmount) || 0;
      const govCharges = Number(lot.emdAmount) || 0;
      const transportCost = Number(lot.transportPayable) || 0;
      const commission = Number(lot.commissionPayable) || 0;
      const otherCharges = (Number(lot.dispatchQty) || Number(lot.quantity)) * (Number(lot.handlingRate) || 65);
      const saleValue = Number(lot.invoiceValue) || ((Number(lot.dispatchQty) || Number(lot.quantity)) * (Number(lot.salesPrice) || 4800));
      const netProfit = saleValue - (purchaseCost + govCharges + transportCost + commission + otherCharges);
      const profitPerMt = netProfit / (Number(lot.quantity) || 1);
      const marginPercent = saleValue > 0 ? (netProfit / saleValue) * 100 : 0;

      initial.purchaseCost = purchaseCost;
      initial.govCharges = govCharges;
      initial.transportCost = transportCost;
      initial.commission = commission;
      initial.otherCharges = otherCharges;
      initial.saleValue = saleValue;
      initial.netProfit = netProfit;
      initial.profitPerMt = Math.round(profitPerMt);
      initial.marginPercent = Number(marginPercent.toFixed(2));
    }

    setFormData(initial);
  }, [stage, lot]);

  const handleChange = (key, val) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // Simulate file upload with progress bar
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate fields
    stage.fields.forEach(field => {
      if (field.required && !formData[field.key] && !field.cumulative) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Process Action
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-1.5">{stage.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stage.fields.map(field => {
              const isReadOnly = (field.cumulative && stage.id !== 'auction') || stage.id === 'profitability' || (lot.stages && lot.stages[stage.id] === 'history');
              const hasError = errors[field.key];

              return (
                <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {field.label} {field.required && !isReadOnly && <span className="text-rose-500">*</span>}
                  </label>

                  {/* Read-Only Cumulative / Auto-calculated values */}
                  {isReadOnly ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-500 font-bold select-none cursor-not-allowed">
                      {field.type === 'number' && typeof formData[field.key] === 'number'
                        ? '₹' + formData[field.key].toLocaleString()
                        : formData[field.key] || '—'}
                    </div>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      rows={3}
                      className={`block w-full text-xs bg-slate-50 border ${
                        hasError ? 'border-rose-400' : 'border-slate-200'
                      } rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all`}
                      placeholder={`Enter notes for ${field.label}...`}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      className={`block w-full text-xs bg-slate-50 border ${
                        hasError ? 'border-rose-400' : 'border-slate-200'
                      } rounded-xl p-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer`}
                    >
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'file' ? (
                    <div className="relative">
                      {uploadingField === field.key ? (
                        /* Simulated Uploading Progress */
                        <div className="bg-slate-50 border border-indigo-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-indigo-600">Uploading: {uploadProgress}%</span>
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 transition-all duration-150" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      ) : formData[field.key] ? (
                        /* Upload Completed */
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 flex items-center justify-between text-xs">
                          <span className="font-semibold text-emerald-700 truncate max-w-[80%]">{formData[field.key]}</span>
                          <Check size={14} className="text-emerald-650 shrink-0" />
                        </div>
                      ) : (
                        /* File Input */
                        <div className="relative group">
                          <input
                            type="file"
                            onChange={e => handleFileUpload(field.key, e.target.files)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className={`flex items-center justify-between px-3 py-2.5 bg-slate-50 border ${
                            hasError ? 'border-rose-400' : 'border-slate-200'
                          } group-hover:border-indigo-400 rounded-xl text-xs text-slate-400 transition-all`}>
                            <span>Simulate Upload Document</span>
                            <Upload size={14} className="text-slate-400 shrink-0" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Default text/number/date inputs */
                    <input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={e => handleChange(field.key, e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className={`block w-full text-xs bg-slate-50 border ${
                        hasError ? 'border-rose-400' : 'border-slate-200'
                      } rounded-xl p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all`}
                    />
                  )}

                  {hasError && (
                    <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle size={10} /> {hasError}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-slate-550 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            {stage.id === 'profitability' ? 'Submit Settlement' : 'Save & Transition'}
          </button>
        </div>
      </div>
    </div>
  );
}
