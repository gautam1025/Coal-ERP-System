import { primaryDeal } from './deals';

export const dashboardMetrics = [
  { title: 'Total Coal Purchased', value: '10,000 MT' },
  { title: 'Total Coal Lifted', value: '6,750 MT' },
  { title: 'Total Coal Pending', value: '3,250 MT' },
  { title: 'Total Coal Sold', value: '6,750 MT' },
  { title: 'Customer Collection Pending', value: '₹1.85 Cr' },
  { title: 'EMD Blocked', value: '₹25.00 L' },
  { title: 'DO Expiring Soon', value: '7 Days' },
  { title: 'Profit', value: '₹1.12 Cr' }
];

export const dashboardWorkflow = [
  'Auction received',
  'EMD paid',
  'Bid won',
  'Sale letter issued',
  'Government payment done',
  'Application received',
  'DO active',
  'Lifting in progress',
  'Dispatch moving',
  'Invoice raised',
  'Collection pending',
  'Profit under review'
];

export const dashboardSummary = {
  dealId: primaryDeal.dealId,
  firm: primaryDeal.firm,
  mine: primaryDeal.mine,
  source: primaryDeal.source,
  grade: primaryDeal.grade,
  quantityLifted: primaryDeal.quantityLifted,
  quantityPending: primaryDeal.quantityPending,
  profit: '₹1.12 Cr'
};