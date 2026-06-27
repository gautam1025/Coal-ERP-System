export const primaryDeal = {
  dealId: 'DEAL-2026-001',
  dealName: 'SECL Kusmunda G10 Auction',
  firm: 'ASAK Coal Pvt. Ltd.',
  source: 'SECL',
  coalCompany: 'SECL',
  mine: 'Kusmunda',
  grade: 'G10',
  quantityOffered: 10000,
  quantityLifted: 6750,
  quantityPending: 3250,
  bidRate: 4200,
  emdAmount: 2500000,
  saleValue: 420000000,
  governmentPayment: 395000000,
  customer: 'XYZ Sponge Pvt Ltd',
  lifter: 'ABC Lifter',
  transporters: ['Shree Transport', 'Ravi Roadlines'],
  status: 'In Progress',
  stage: 'Dispatch',
  timelineStatus: '87% complete'
};

export const deals = [primaryDeal];

export const dealById = (dealId) => deals.find((deal) => deal.dealId === dealId) || primaryDeal;