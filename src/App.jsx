import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Providers from './app/providers';
import AppRoutes from './app/routes';
import { primaryDeal, deals } from './data/deals';
import { dashboardMetrics, dashboardWorkflow, dashboardSummary } from './data/dashboard';
import { firmMasters, coalSources, mineMasters, coalGradeMasters } from './data/masters';
import { financeSummary, financeLines } from './data/finance';
import { initializeStorage } from './utils/storageManager';
import { getWorkflowData } from './data/workflowStore';

function App() {
  useEffect(() => {
    initializeStorage();

    // Seed demo user
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify({
        id: 'coal-demo-admin',
        name: 'Coal Demo Admin',
        role: 'ADMIN'
      }));
    }

    // Seed master data into localStorage (only if not already set)
    const seeds = [
      ['coal_firms',   firmMasters],
      ['coal_sources', coalSources],
      ['coal_mines',   mineMasters],
      ['coal_grades',  coalGradeMasters],
    ];
    seeds.forEach(([key, data]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    });

    // Initialize workflow lot state machine
    getWorkflowData();

    // Dev checkpoint
    window.__COAL_ERP_DEMO_DATA__ = {
      batch: 'Batch 5 - masters routing + support hub',
      deal: primaryDeal,
      deals,
      dashboard: { metrics: dashboardMetrics, workflow: dashboardWorkflow, summary: dashboardSummary },
      masters: { firms: firmMasters, sources: coalSources, mines: mineMasters, grades: coalGradeMasters },
      finance: { summary: financeSummary, lines: financeLines }
    };

    if (import.meta.env.DEV) {
      console.info('[Coal ERP] Batch 5 checkpoint ready', window.__COAL_ERP_DEMO_DATA__);
    }
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Providers>
        {/* Batch 5: Masters now have real routes, floating panel removed */}
        <AppRoutes />
      </Providers>
    </Router>
  );
}

export default App;