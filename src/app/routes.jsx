import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Dashboard from '../pages/dashboard/Dashboard';
import Deal360 from '../pages/coal/Deal360';
import MastersPage from '../pages/masters/MastersPage';
import SupportHub from '../pages/support/SupportHub';
import AuditTrail from '../pages/support/AuditTrail';
import Reports from '../pages/support/Reports';
import Settings from '../pages/Settings';

// Import all 19 workflow stage components
import AuctionNotification from '../pages/workflow/AuctionNotification';
import EMDManagement from '../pages/workflow/EMDManagement';
import BidManagement from '../pages/workflow/BidManagement';
import SaleLetter from '../pages/workflow/SaleLetter';
import PaymentAdvice from '../pages/workflow/PaymentAdvice';
import GovernmentPayment from '../pages/workflow/GovernmentPayment';
import ApplicationSubmission from '../pages/workflow/ApplicationSubmission';
import DeliveryOrder from '../pages/workflow/DeliveryOrder';
import LifterAssignment from '../pages/workflow/LifterAssignment';
import WorkOrder from '../pages/workflow/WorkOrder';
import Dispatch from '../pages/workflow/Dispatch';
import CustomerOrder from '../pages/workflow/CustomerOrder';
import Allocation from '../pages/workflow/Allocation';
import Invoice from '../pages/workflow/Invoice';
import Collection from '../pages/workflow/Collection';
import TransportPayment from '../pages/workflow/TransportPayment';
import Commission from '../pages/workflow/Commission';
import RefundLapse from '../pages/workflow/RefundLapse';
import Profitability from '../pages/workflow/Profitability';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="deal/DEAL-2026-001" element={<Deal360 />} />
        
        {/* Workflow Stage Routes */}
        <Route path="workflow/auction" element={<AuctionNotification />} />
        <Route path="workflow/emd" element={<EMDManagement />} />
        <Route path="workflow/bid" element={<BidManagement />} />
        <Route path="workflow/sale-letter" element={<SaleLetter />} />
        <Route path="workflow/payment-advice" element={<PaymentAdvice />} />
        <Route path="workflow/government-payment" element={<GovernmentPayment />} />
        <Route path="workflow/application-submission" element={<ApplicationSubmission />} />
        <Route path="workflow/delivery-order" element={<DeliveryOrder />} />
        <Route path="workflow/lifter-management" element={<LifterAssignment />} />
        <Route path="workflow/lifting-work-order" element={<WorkOrder />} />
        <Route path="workflow/truck-dispatch" element={<Dispatch />} />
        <Route path="workflow/customer-order" element={<CustomerOrder />} />
        <Route path="workflow/do-allocation" element={<Allocation />} />
        <Route path="workflow/invoice" element={<Invoice />} />
        <Route path="workflow/collection" element={<Collection />} />
        <Route path="workflow/transport" element={<TransportPayment />} />
        <Route path="workflow/commission" element={<Commission />} />
        <Route path="workflow/refund" element={<RefundLapse />} />
        <Route path="workflow/profitability" element={<Profitability />} />

        <Route path="masters/:masterType" element={<MastersPage />} />
        <Route path="masters" element={<Navigate to="/masters/firms" replace />} />
        <Route path="support" element={<SupportHub />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
