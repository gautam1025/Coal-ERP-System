import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FirmMaster from './FirmMaster';
import CoalCompanyMaster from './CoalCompanyMaster';
import MineMaster from './MineMaster';
import CoalGradeMaster from './CoalGradeMaster';
import { firmMasters, coalSources, mineMasters, coalGradeMasters } from '../../data/masters';

// Seed localStorage keys if not already present
const STORAGE = {
  firms:     { key: 'coal_firms',   seed: firmMasters },
  sources:   { key: 'coal_sources', seed: coalSources },
  mines:     { key: 'coal_mines',   seed: mineMasters },
  grades:    { key: 'coal_grades',  seed: coalGradeMasters },
};

function getStoreData(type) {
  const cfg = STORAGE[type];
  if (!cfg) return [];
  const raw = localStorage.getItem(cfg.key);
  if (!raw) {
    localStorage.setItem(cfg.key, JSON.stringify(cfg.seed));
    return cfg.seed;
  }
  return JSON.parse(raw);
}

function saveStoreData(type, data) {
  const cfg = STORAGE[type];
  if (cfg) localStorage.setItem(cfg.key, JSON.stringify(data));
}

const MASTER_CONFIG = {
  firms:   { label: 'Firm Master' },
  sources: { label: 'Coal Company / Source Master' },
  mines:   { label: 'Mine Master' },
  grades:  { label: 'Coal Grade Master' },
};

export default function MastersPage() {
  const { masterType = 'firms' } = useParams();
  const cfg = MASTER_CONFIG[masterType];

  const [data, setData] = useState(() => getStoreData(masterType));

  // Sync data state when URL masterType changes
  useEffect(() => {
    setData(getStoreData(masterType));
  }, [masterType]);

  const handleAdd = (item) => {
    const updated = [...data, item];
    setData(updated);
    saveStoreData(masterType, updated);
  };

  const handleDelete = (nameKey) => {
    const keyMap = { firms: 'firmName', sources: 'sourceName', mines: 'mineName', grades: 'gradeName' };
    const field = keyMap[masterType];
    const updated = data.filter(d => d[field] !== nameKey);
    setData(updated);
    saveStoreData(masterType, updated);
  };

  if (!cfg) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Unknown master type: {masterType}
      </div>
    );
  }

  const sharedProps = { data, onAdd: handleAdd, onDelete: handleDelete };

  return (
    <>
      {masterType === 'firms'   && <FirmMaster {...sharedProps} />}
      {masterType === 'sources' && <CoalCompanyMaster {...sharedProps} />}
      {masterType === 'mines'   && <MineMaster {...sharedProps} companies={getStoreData('sources')} />}
      {masterType === 'grades'  && <CoalGradeMaster {...sharedProps} />}
    </>
  );
}
