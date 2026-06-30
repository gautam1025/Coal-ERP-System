const fs = require('fs');
const path = 'src/pages/workflow/WorkOrderProcessModal.jsx';
let content = fs.readFileSync(path, 'utf8');

const helpersRegex = /\/\* ── small helpers ── \*\/[\s\S]*?};\s*\/\* ══════════════════════════════════════════════════════════════ \*\//;
content = content.replace(helpersRegex, '/* ══════════════════════════════════════════════════════════════ */');

const newHelpers = `/* ── small helpers ── */
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
          <div className="bg-indigo-600 h-1.5 transition-all duration-150" style={{ width: \`\${uploadProgress}%\` }} />
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
`;

content = content.replace('export default function WorkOrderProcessModal', newHelpers + '\nexport default function WorkOrderProcessModal');

content = content.replace(/<Field ([^>]+)>/g, '<Field $1 isViewOnly={isViewOnly} errors={errors}>');
content = content.replace(/<ReadonlyOrInput ([^>]+)\/>/g, '<ReadonlyOrInput $1 isViewOnly={isViewOnly} formData={formData} handleChange={handleChange} errors={errors} />');
content = content.replace(/<FileUploadField ([^>]+)\/>/g, '<FileUploadField $1 isViewOnly={isViewOnly} formData={formData} uploadingField={uploadingField} uploadProgress={uploadProgress} handleFileUpload={handleFileUpload} />');

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
