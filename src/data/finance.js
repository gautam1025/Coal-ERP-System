import { primaryDeal } from './deals';

export const financeSummary = {
  dealId: primaryDeal.dealId,
  emdAmount: primaryDeal.emdAmount,
  grossSaleValue: primaryDeal.saleValue,
  governmentPayment: primaryDeal.governmentPayment,
  transportPayable: 1850000,
  commissionPayable: 225000,
  collectionPending: 18500000,
  refundPending: 0,
  lapsePending: 0,
  netProfit: 11200000,
  profitMarginPercent: 26.7
};

export const financeLines = [
  { label: 'EMD Paid', value: '₹25.00 L' },
  { label: 'Government Payment', value: '₹3.95 Cr' },
  { label: 'Transport Payable', value: '₹18.50 L' },
  { label: 'Commission Payable', value: '₹2.25 L' },
  { label: 'Collection Pending', value: '₹1.85 Cr' },
  { label: 'Net Profit', value: '₹1.12 Cr' }
];