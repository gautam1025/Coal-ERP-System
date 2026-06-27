// Workflow Store - Manages the stage definitions, columns, fields, and lot state transitions.

export const WORKFLOW_STAGES = [
  {
    id: 'auction',
    title: 'Auction Notification',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Firm', key: 'firm' },
      { header: 'Source', key: 'source' },
      { header: 'Mine', key: 'mine' },
      { header: 'Grade', key: 'grade' },
      { header: 'Qty Offered (MT)', key: 'quantity' },
      { header: 'Base Price (₹/MT)', key: 'bidRate' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'firm', label: 'Firm', cumulative: true },
      { key: 'source', label: 'Auction Source', cumulative: true },
      { key: 'auctionNo', label: 'Auction Number', type: 'text', required: true },
      { key: 'notificationDate', label: 'Notification Date', type: 'date', required: true },
      { key: 'bidDate', label: 'Bid Date', type: 'date', required: true },
      { key: 'bidClosingDate', label: 'Bid Closing Date', type: 'date', required: true },
      { key: 'coalCompany', label: 'Coal Company', type: 'text', required: true },
      { key: 'mine', label: 'Mine', type: 'text', required: true },
      { key: 'grade', label: 'Coal Grade', type: 'text', required: true },
      { key: 'quantity', label: 'Quantity Offered (MT)', type: 'number', required: true },
      { key: 'bidRate', label: 'Base Price (₹/MT)', type: 'number', required: true },
      { key: 'emdAmount', label: 'EMD Required (₹)', type: 'number', required: true },
      { key: 'notificationDoc', label: 'Notification Document', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'emd',
    title: 'EMD Management',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Firm', key: 'firm' },
      { header: 'EMD Amount (₹)', key: 'emdAmount' },
      { header: 'Bank', key: 'bank' },
      { header: 'UTR Reference', key: 'utr' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'auctionNo', label: 'Auction Number', cumulative: true },
      { key: 'emdAmount', label: 'EMD Amount (₹)', type: 'number', required: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'bank', label: 'Bank', type: 'text', required: true },
      { key: 'utr', label: 'UTR Number', type: 'text', required: true },
      { key: 'paymentReceiptDoc', label: 'Payment Receipt Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'bid',
    title: 'Bid Management',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Firm', key: 'firm' },
      { header: 'Mine', key: 'mine' },
      { header: 'Bid Qty (MT)', key: 'quantity' },
      { header: 'Bid Rate (₹/MT)', key: 'bidRate' },
      { header: 'Result', key: 'statusText' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'quantity', label: 'Bid Quantity (MT)', cumulative: true },
      { key: 'bidRate', label: 'Bid Rate (₹/MT)', cumulative: true },
      { key: 'expectedSaleRate', label: 'Expected Sale Rate (₹/MT)', type: 'number', required: true },
      { key: 'expectedMargin', label: 'Expected Margin (₹/MT)', type: 'number', required: true },
      { key: 'expectedProfit', label: 'Expected Profit (₹)', type: 'number', required: true },
      { key: 'submittedBy', label: 'Submitted By', type: 'text', required: true },
      { key: 'bidSubmissionDate', label: 'Bid Submission Date', type: 'date', required: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'sale-letter',
    title: 'Sale Letter',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Sale Letter No', key: 'saleLetterNo' },
      { header: 'Allocated Qty', key: 'quantity' },
      { header: 'Lifting Days', key: 'liftingDays' },
      { header: 'Date Received', key: 'saleLetterDate' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'saleLetterNo', label: 'Sale Letter Number', type: 'text', required: true },
      { key: 'saleLetterDate', label: 'Sale Letter Date', type: 'date', required: true },
      { key: 'quantity', label: 'Quantity (MT)', cumulative: true },
      { key: 'bidRate', label: 'Rate (₹/MT)', cumulative: true },
      { key: 'totalAmount', label: 'Total Amount (₹)', type: 'number', required: true },
      { key: 'dueDate', label: 'Payment Due Date', type: 'date', required: true },
      { key: 'saleLetterDoc', label: 'Sale Letter Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'payment-advice',
    title: 'Payment Advice',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Advice No', key: 'paymentAdviceNo' },
      { header: 'Govt Cost (₹)', key: 'paymentAmount' },
      { header: 'Due Date', key: 'dueDate' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'paymentAdviceNo', label: 'Advice Number', type: 'text', required: true },
      { key: 'adviceDate', label: 'Advice Date', type: 'date', required: true },
      { key: 'paymentAmount', label: 'Gross Amount (₹)', type: 'number', required: true },
      { key: 'emdAmount', label: 'Less EMD (₹)', cumulative: true },
      { key: 'netPayable', label: 'Net Payable (₹)', type: 'number', required: true },
      { key: 'taxes', label: 'Taxes (₹)', type: 'number', required: true },
      { key: 'otherCharges', label: 'Other Charges (₹)', type: 'number', required: true },
      { key: 'dueDate', label: 'Payment Due Date', type: 'date', required: true },
      { key: 'adviceDoc', label: 'Payment Advice Upload', type: 'file' }
    ]
  },
  {
    id: 'government-payment',
    title: 'Government Payment',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Advice No', key: 'paymentAdviceNo' },
      { header: 'Paid Amount (₹)', key: 'paymentAmount' },
      { header: 'Payment UTR', key: 'utr' },
      { header: 'Date Paid', key: 'paymentDate' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'bank', label: 'Bank Name', cumulative: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'paymentAmount', label: 'Net Paid Amount (₹)', cumulative: true },
      { key: 'utr', label: 'UTR Number', cumulative: true },
      { key: 'paymentProofDoc', label: 'Payment Proof Upload', type: 'file' },
      { key: 'sentToOffice', label: 'Sent To Office', type: 'select', options: ['Yes', 'No'] },
      { key: 'sentDate', label: 'Sent Date', type: 'date', required: true },
      { key: 'responsiblePerson', label: 'Responsible Person', type: 'text', required: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'application-submission',
    title: 'Application Submission',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Submission No', key: 'submissionNo' },
      { header: 'Govt Office', key: 'source' },
      { header: 'Receipt Status', key: 'receiptStatus' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'source', label: 'Office Name', cumulative: true },
      { key: 'applicationDate', label: 'Application Date', type: 'date', required: true },
      { key: 'submittedBy', label: 'Submitted By', type: 'text', required: true },
      { key: 'saleLetterAttached', label: 'Sale Letter Attached', type: 'select', options: ['Yes', 'No'] },
      { key: 'utrAttached', label: 'UTR Attached', type: 'select', options: ['Yes', 'No'] },
      { key: 'authLetterAttached', label: 'Authorization Letter', type: 'select', options: ['Yes', 'No'] },
      { key: 'firmDocsAttached', label: 'Firm Documents', type: 'select', options: ['Yes', 'No'] },
      { key: 'otherDocsAttached', label: 'Other Documents', type: 'select', options: ['Yes', 'No'] },
      { key: 'submissionNo', label: 'Receipt Number', type: 'text', required: true },
      { key: 'receiptDoc', label: 'Receipt Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'delivery-order',
    title: 'Delivery Order',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'DO Number', key: 'doNo' },
      { header: 'DO Qty (MT)', key: 'quantity' },
      { header: 'Expiry Date', key: 'doExpiry' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'doNo', label: 'DO Number', type: 'text', required: true },
      { key: 'doDate', label: 'DO Date', type: 'date', required: true },
      { key: 'validFrom', label: 'Valid From', type: 'date', required: true },
      { key: 'doExpiry', label: 'Valid Till', cumulative: true },
      { key: 'quantity', label: 'Allowed Quantity (MT)', cumulative: true },
      { key: 'doDoc', label: 'DO Copy Upload', type: 'file' },
      { key: 'signedCopyDoc', label: 'Signed & Sealed Copy', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'lifter-management',
    title: 'Lifter Assignment',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'DO Number', key: 'doNo' },
      { header: 'Assigned Lifter', key: 'lifter' },
      { header: 'Handling Rate (₹/MT)', key: 'handlingRate' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'lifter', label: 'Lifter Name', type: 'text', required: true },
      { key: 'allocatedQty', label: 'Assigned Quantity (MT)', cumulative: true },
      { key: 'woNo', label: 'Work Order Number', type: 'text', required: true },
      { key: 'woDate', label: 'Work Order Date', type: 'date', required: true },
      { key: 'doCopySent', label: 'DO Copy Sent', type: 'select', options: ['Yes', 'No'] },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'lifting-work-order',
    title: 'Work Order',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Work Order No', key: 'woNo' },
      { header: 'Lifter', key: 'lifter' },
      { header: 'Target Speed', key: 'liftingSpeed' }
    ],
    fields: [
      { key: 'woNo', label: 'Work Order Number', cumulative: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'targetCompletionDate', label: 'Target Completion Date', type: 'date', required: true },
      { key: 'terms', label: 'Terms', type: 'text', required: true },
      { key: 'handlingRate', label: 'Rate (₹/MT)', cumulative: true },
      { key: 'woDoc', label: 'Document Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'truck-dispatch',
    title: 'Dispatch',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Transporter', key: 'transporter' },
      { header: 'Truck Count', key: 'trucks' },
      { header: 'Dispatched Qty', key: 'dispatchQty' }
    ],
    fields: [
      { key: 'dispatchId', label: 'Dispatch ID', type: 'text', required: true },
      { key: 'truckNo', label: 'Truck Number', type: 'text', required: true },
      { key: 'driverName', label: 'Driver Name', type: 'text', required: true },
      { key: 'driverMobile', label: 'Driver Mobile', type: 'text', required: true },
      { key: 'transporter', label: 'Transporter', cumulative: true },
      { key: 'loadingDate', label: 'Loading Date', type: 'date', required: true },
      { key: 'loadingTime', label: 'Loading Time', type: 'text', required: true },
      { key: 'mineWeight', label: 'Mine Weight (MT)', type: 'number', required: true },
      { key: 'royaltyNo', label: 'Royalty Number', type: 'text', required: true },
      { key: 'destinationParty', label: 'Destination Party', type: 'text', required: true },
      { key: 'destination', label: 'Destination', type: 'text', required: true },
      { key: 'freightRate', label: 'Freight Rate (₹/MT)', type: 'number', required: true },
      { key: 'advancePaid', label: 'Advance Paid (₹)', type: 'number', required: true },
      { key: 'dispatchDoc', label: 'Documents Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'customer-order',
    title: 'Customer Order',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Customer Name', key: 'customer' },
      { header: 'Sales Qty (MT)', key: 'quantity' },
      { header: 'Sales Price (₹/MT)', key: 'salesPrice' }
    ],
    fields: [
      { key: 'salesOrderNo', label: 'Sales Order Number', type: 'text', required: true },
      { key: 'customer', label: 'Customer', cumulative: true },
      { key: 'orderDate', label: 'Order Date', type: 'date', required: true },
      { key: 'quantity', label: 'Quantity (MT)', cumulative: true },
      { key: 'salesPrice', label: 'Rate (₹/MT)', cumulative: true },
      { key: 'deliveryTargetDate', label: 'Delivery Target Date', type: 'date', required: true },
      { key: 'paymentTerms', label: 'Payment Terms', type: 'text', required: true },
      { key: 'broker', label: 'Broker', cumulative: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'do-allocation',
    title: 'Allocation',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Customer', key: 'customer' },
      { header: 'Allocated (MT)', key: 'allocatedQty' },
      { header: 'DO Reference', key: 'doNo' }
    ],
    fields: [
      { key: 'dealId', label: 'Deal ID', cumulative: true },
      { key: 'doNo', label: 'DO Number', cumulative: true },
      { key: 'customer', label: 'Customer', cumulative: true },
      { key: 'allocatedQty', label: 'Allocated Quantity (MT)', cumulative: true },
      { key: 'targetDate', label: 'Target Date', type: 'date', required: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'invoice',
    title: 'Invoice',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Invoice No', key: 'invoiceNo' },
      { header: 'Billing Qty (MT)', key: 'dispatchQty' },
      { header: 'Invoice Value (₹)', key: 'invoiceValue' }
    ],
    fields: [
      { key: 'invoiceNo', label: 'Invoice Number', type: 'text', required: true },
      { key: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
      { key: 'dispatchQty', label: 'Quantity (MT)', cumulative: true },
      { key: 'salesPrice', label: 'Rate (₹/MT)', cumulative: true },
      { key: 'gst', label: 'GST (%)', type: 'number', required: true },
      { key: 'taxableAmount', label: 'Taxable Amount (₹)', type: 'number', required: true },
      { key: 'invoiceValue', label: 'Total Amount (₹)', cumulative: true },
      { key: 'dueDate', label: 'Due Date', type: 'date', required: true },
      { key: 'invoiceDoc', label: 'Invoice Upload', type: 'file' }
    ]
  },
  {
    id: 'collection',
    title: 'Collection',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Invoice No', key: 'invoiceNo' },
      { header: 'Collected (₹)', key: 'collectedAmount' },
      { header: 'Outstanding (₹)', key: 'outstanding' }
    ],
    fields: [
      { key: 'invoiceNo', label: 'Invoice Number', cumulative: true },
      { key: 'collectedAmount', label: 'Received Amount (₹)', cumulative: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'bank', label: 'Bank', cumulative: true },
      { key: 'utr', label: 'UTR', cumulative: true },
      { key: 'tds', label: 'TDS (₹)', type: 'number', required: true },
      { key: 'deduction', label: 'Deduction (₹)', type: 'number', required: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'transport',
    title: 'Transport Payment',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Transporter', key: 'transporter' },
      { header: 'Bill No', key: 'transportBillNo' },
      { header: 'Payable Amount (₹)', key: 'transportPayable' }
    ],
    fields: [
      { key: 'transporter', label: 'Transporter', cumulative: true },
      { key: 'dispatchId', label: 'Dispatch ID', cumulative: true },
      { key: 'transportPayable', label: 'Freight Amount (₹)', cumulative: true },
      { key: 'advance', label: 'Advance (₹)', type: 'number', required: true },
      { key: 'balance', label: 'Balance (₹)', type: 'number', required: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'utr', label: 'UTR Number', cumulative: true },
      { key: 'transportDoc', label: 'Transport Bill Upload', type: 'file' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'commission',
    title: 'Commission',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Broker Agent', key: 'broker' },
      { header: 'Commission Rate', key: 'commissionRate' },
      { header: 'Payable Fee (₹)', key: 'commissionPayable' }
    ],
    fields: [
      { key: 'broker', label: 'Broker', cumulative: true },
      { key: 'commissionRate', label: 'Commission Rate', cumulative: true },
      { key: 'commissionPayable', label: 'Commission Amount (₹)', cumulative: true },
      { key: 'paidAmount', label: 'Paid Amount (₹)', type: 'number', required: true },
      { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'refund',
    title: 'Refund / Lapse',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Refund Claim No', key: 'claimNo' },
      { header: 'Claimed (₹)', key: 'refundAmount' },
      { header: 'Status', key: 'refundStatus' }
    ],
    fields: [
      { key: 'doNo', label: 'DO Number', cumulative: true },
      { key: 'unliftedQty', label: 'Unlifted Quantity', type: 'number', required: true },
      { key: 'refundAmount', label: 'Refund Eligible Amount (₹)', cumulative: true },
      { key: 'lapseAmount', label: 'Lapse Amount (₹)', type: 'number', required: true },
      { key: 'applicationDate', label: 'Application Date', type: 'date', required: true },
      { key: 'docsSubmitted', label: 'Documents Submitted', type: 'select', options: ['Yes', 'No'] },
      { key: 'refundStatus', label: 'Government Status', cumulative: true },
      { key: 'utr', label: 'Refund UTR', cumulative: true },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  },
  {
    id: 'profitability',
    title: 'Profitability',
    columns: [
      { header: 'Lot No', key: 'lotNo' },
      { header: 'Total Revenue (₹)', key: 'revenue' },
      { header: 'Total Expenses (₹)', key: 'expenses' },
      { header: 'Net Profit (₹)', key: 'profitAmount' }
    ],
    fields: [
      { key: 'purchaseCost', label: 'Purchase Cost (₹)', type: 'number' },
      { key: 'govCharges', label: 'Government Charges (₹)', type: 'number' },
      { key: 'transportCost', label: 'Transport Cost (₹)', type: 'number' },
      { key: 'commission', label: 'Commission (₹)', type: 'number' },
      { key: 'otherCharges', label: 'Other Charges (₹)', type: 'number' },
      { key: 'saleValue', label: 'Sale Value (₹)', type: 'number' },
      { key: 'netProfit', label: 'Net Profit (₹)', type: 'number' },
      { key: 'profitPerMt', label: 'Profit / MT (₹)', type: 'number' },
      { key: 'marginPercent', label: 'Margin %', type: 'number' },
      { key: 'remarks', label: 'Remarks', type: 'textarea' }
    ]
  }
];

export const INITIAL_LOT_DATA = [
  {
    id: 'LOT-01',
    lotNo: 'LOT-2026-001',
    dealId: 'DEAL-2026-001',
    firm: 'ASAK Coal Pvt. Ltd.',
    mine: 'Kusmunda',
    coalCompany: 'SECL',
    source: 'SECL',
    grade: 'G10',
    quantity: 10000,
    bidRate: 4200,
    emdAmount: 2500000,
    bank: 'SBI',
    utr: 'SBI123456789',
    statusText: 'Bid Won',
    saleLetterNo: 'SL-SECL-2026-001',
    liftingDays: 45,
    saleLetterDate: '2026-01-20',
    paymentAdviceNo: 'PA-SECL-001',
    paymentAmount: 395000000,
    dueDate: '2026-02-10',
    paymentDate: '2026-02-08',
    submissionNo: 'SUB-2026-102',
    receiptStatus: 'Acknowledged',
    doNo: 'DO-SECL-001',
    doExpiry: '2026-04-15',
    lifter: 'ABC Lifter',
    handlingRate: 65,
    woNo: 'WO-ASAK-01',
    liftingSpeed: '1200 MT/day',
    transporter: 'Shree Transport',
    trucks: 185,
    dispatchQty: 6750,
    customer: 'XYZ Sponge Pvt Ltd',
    salesPrice: 4800,
    allocatedQty: 6750,
    invoiceNo: 'INV-2026-018',
    invoiceValue: 32400000,
    collectedAmount: 18500000,
    outstanding: 13900000,
    transportBillNo: 'TB-SHREE-01',
    transportPayable: 1350000,
    broker: 'Shyam Agencies',
    commissionRate: '₹50/MT',
    commissionPayable: 337500,
    claimNo: 'REF-2026-01',
    refundAmount: 1200050,
    refundStatus: 'In Process',
    revenue: 48000000,
    expenses: 36800000,
    profitAmount: 11200000,
    
    stages: {
      'auction': 'history',
      'emd': 'history',
      'bid': 'history',
      'sale-letter': 'history',
      'payment-advice': 'history',
      'government-payment': 'history',
      'application-submission': 'history',
      'delivery-order': 'pending',
      'lifter-management': 'pending',
      'lifting-work-order': 'pending',
      'truck-dispatch': 'pending',
      'customer-order': 'pending',
      'do-allocation': 'pending',
      'invoice': 'pending',
      'collection': 'pending',
      'transport': 'pending',
      'commission': 'pending',
      'refund': 'pending',
      'profitability': 'pending'
    }
  },
  {
    id: 'LOT-02',
    lotNo: 'LOT-2026-002',
    dealId: 'DEAL-2026-001',
    firm: 'ASAK Coal Pvt. Ltd.',
    mine: 'Kusmunda',
    coalCompany: 'SECL',
    source: 'SECL',
    grade: 'G10',
    quantity: 3000,
    bidRate: 4200,
    emdAmount: 750000,
    bank: 'HDFC',
    utr: 'HDFCBID9823',
    statusText: 'Awaiting',
    saleLetterNo: 'SL-SECL-2026-002',
    liftingDays: 45,
    saleLetterDate: '2026-02-10',
    paymentAdviceNo: 'PA-SECL-002',
    paymentAmount: 12600000,
    dueDate: '2026-03-05',
    paymentDate: '2026-03-03',
    submissionNo: 'SUB-2026-103',
    receiptStatus: 'Pending Office Approval',
    doNo: 'DO-SECL-002',
    doExpiry: '2026-05-15',
    lifter: 'XYZ handling',
    handlingRate: 70,
    woNo: 'WO-ASAK-02',
    liftingSpeed: '1000 MT/day',
    transporter: 'Ravi Roadlines',
    trucks: 50,
    dispatchQty: 1800,
    customer: 'Jai Bharat Steel',
    salesPrice: 4750,
    allocatedQty: 1800,
    invoiceNo: 'INV-2026-022',
    invoiceValue: 8550000,
    collectedAmount: 8550000,
    outstanding: 0,
    transportBillNo: 'TB-RAVI-02',
    transportPayable: 360000,
    broker: 'Girish Brothers',
    commissionRate: '₹40/MT',
    commissionPayable: 72000,
    claimNo: 'REF-2026-02',
    refundAmount: 360000,
    refundStatus: 'Settled',
    revenue: 14250000,
    expenses: 11520000,
    profitAmount: 2730000,
    stages: {
      'auction': 'history',
      'emd': 'history',
      'bid': 'history',
      'sale-letter': 'pending',
      'payment-advice': 'pending',
      'government-payment': 'pending',
      'application-submission': 'pending',
      'delivery-order': 'pending',
      'lifter-management': 'pending',
      'lifting-work-order': 'pending',
      'truck-dispatch': 'pending',
      'customer-order': 'pending',
      'do-allocation': 'pending',
      'invoice': 'pending',
      'collection': 'pending',
      'transport': 'pending',
      'commission': 'pending',
      'refund': 'pending',
      'profitability': 'pending'
    }
  },
  {
    id: 'LOT-03',
    lotNo: 'LOT-2026-003',
    dealId: 'DEAL-2026-001',
    firm: 'Jai Bhole Enterprises',
    mine: 'Kusmunda',
    coalCompany: 'MSTC',
    source: 'MSTC',
    grade: 'G11',
    quantity: 5000,
    bidRate: 4100,
    emdAmount: 1250000,
    bank: 'SBI',
    utr: 'SBI987654321',
    statusText: 'Awaiting',
    saleLetterNo: '',
    liftingDays: 0,
    saleLetterDate: '',
    paymentAdviceNo: '',
    paymentAmount: 0,
    dueDate: '',
    paymentDate: '',
    submissionNo: '',
    receiptStatus: '',
    doNo: '',
    doExpiry: '',
    lifter: '',
    handlingRate: 0,
    woNo: '',
    liftingSpeed: '',
    transporter: '',
    trucks: 0,
    dispatchQty: 0,
    customer: '',
    salesPrice: 0,
    allocatedQty: 0,
    invoiceNo: '',
    invoiceValue: 0,
    collectedAmount: 0,
    outstanding: 0,
    transportBillNo: '',
    transportPayable: 0,
    broker: '',
    commissionRate: '',
    commissionPayable: 0,
    claimNo: '',
    refundAmount: 0,
    refundStatus: '',
    revenue: 0,
    expenses: 0,
    profitAmount: 0,
    stages: {
      'auction': 'history',
      'emd': 'pending',
      'bid': 'pending',
      'sale-letter': 'pending',
      'payment-advice': 'pending',
      'government-payment': 'pending',
      'application-submission': 'pending',
      'delivery-order': 'pending',
      'lifter-management': 'pending',
      'lifting-work-order': 'pending',
      'truck-dispatch': 'pending',
      'customer-order': 'pending',
      'do-allocation': 'pending',
      'invoice': 'pending',
      'collection': 'pending',
      'transport': 'pending',
      'commission': 'pending',
      'refund': 'pending',
      'profitability': 'pending'
    }
  }
];

export const getWorkflowData = () => {
  const data = localStorage.getItem('coal_workflow_lots');
  if (!data) {
    localStorage.setItem('coal_workflow_lots', JSON.stringify(INITIAL_LOT_DATA));
    return INITIAL_LOT_DATA;
  }
  return JSON.parse(data);
};

export const saveWorkflowData = (lots) => {
  localStorage.setItem('coal_workflow_lots', JSON.stringify(lots));
};

export const transitionLotStage = (lotId, currentStageId, formData = {}) => {
  const lots = getWorkflowData();
  const lotIdx = lots.findIndex(l => l.id === lotId);
  if (lotIdx === -1) return;

  const lot = lots[lotIdx];
  const stageIdx = WORKFLOW_STAGES.findIndex(s => s.id === currentStageId);
  
  if (stageIdx !== -1) {
    // 1. Merge form fields submitted via ProcessModal into the lot object
    Object.keys(formData).forEach(key => {
      lot[key] = formData[key];
    });

    // 2. Mark current stage as completed
    lot.stages[currentStageId] = 'history';
    
    // 3. Unlock the next stage as pending
    const nextStage = WORKFLOW_STAGES[stageIdx + 1];
    if (nextStage) {
      lot.stages[nextStage.id] = 'pending';
      
      // Auto-prefill subsequent stages if fields don't exist yet
      if (nextStage.id === 'emd' && !lot.emdAmount) {
        lot.emdAmount = lot.quantity * 250;
        lot.bank = 'SBI';
        lot.utr = 'UTR' + Math.floor(100000 + Math.random() * 900000);
      }
      if (nextStage.id === 'sale-letter' && !lot.saleLetterNo) {
        lot.saleLetterNo = 'SL-SECL-' + Math.floor(1000 + Math.random() * 9000);
        lot.liftingDays = 45;
        lot.saleLetterDate = new Date().toISOString().split('T')[0];
      }
      if (nextStage.id === 'payment-advice' && !lot.paymentAdviceNo) {
        lot.paymentAdviceNo = 'PA-SECL-' + Math.floor(100 + Math.random() * 900);
        lot.paymentAmount = lot.quantity * lot.bidRate;
        const due = new Date();
        due.setDate(due.getDate() + 15);
        lot.dueDate = due.toISOString().split('T')[0];
      }
      if (nextStage.id === 'government-payment' && !lot.paymentDate) {
        lot.paymentDate = new Date().toISOString().split('T')[0];
        lot.utr = 'PAY' + Math.floor(100000 + Math.random() * 900000);
      }
      if (nextStage.id === 'application-submission' && !lot.submissionNo) {
        lot.submissionNo = 'SUB-' + Math.floor(1000 + Math.random() * 9000);
        lot.receiptStatus = 'Acknowledged';
      }
      if (nextStage.id === 'delivery-order' && !lot.doNo) {
        lot.doNo = 'DO-SECL-' + Math.floor(1000 + Math.random() * 9000);
        const exp = new Date();
        exp.setDate(exp.getDate() + 45);
        lot.doExpiry = exp.toISOString().split('T')[0];
      }
      if (nextStage.id === 'lifter-management' && !lot.lifter) {
        lot.lifter = 'ABC Lifter';
        lot.handlingRate = 65;
      }
      if (nextStage.id === 'lifting-work-order' && !lot.woNo) {
        lot.woNo = 'WO-ASAK-' + Math.floor(10 + Math.random() * 90);
        lot.liftingSpeed = '1200 MT/day';
      }
      if (nextStage.id === 'truck-dispatch' && !lot.transporter) {
        lot.transporter = 'Shree Transport';
        lot.trucks = Math.floor(20 + Math.random() * 100);
        lot.dispatchQty = Math.floor(lot.quantity * 0.6);
      }
      if (nextStage.id === 'customer-order' && !lot.customer) {
        lot.customer = 'XYZ Sponge Pvt Ltd';
        lot.salesPrice = lot.bidRate + 600;
      }
      if (nextStage.id === 'do-allocation' && !lot.allocatedQty) {
        lot.allocatedQty = lot.dispatchQty;
      }
      if (nextStage.id === 'invoice' && !lot.invoiceNo) {
        lot.invoiceNo = 'INV-2026-' + Math.floor(100 + Math.random() * 900);
        lot.invoiceValue = lot.dispatchQty * lot.salesPrice;
      }
      if (nextStage.id === 'collection' && !lot.collectedAmount) {
        lot.collectedAmount = Math.floor(lot.invoiceValue * 0.7);
        lot.outstanding = lot.invoiceValue - lot.collectedAmount;
      }
      if (nextStage.id === 'transport' && !lot.transportBillNo) {
        lot.transportBillNo = 'TB-SHREE-' + Math.floor(10 + Math.random() * 90);
        lot.transportPayable = lot.dispatchQty * 200;
      }
      if (nextStage.id === 'commission' && !lot.broker) {
        lot.broker = 'Shyam Agencies';
        lot.commissionRate = '₹50/MT';
        lot.commissionPayable = lot.dispatchQty * 50;
      }
      if (nextStage.id === 'refund' && !lot.claimNo) {
        lot.claimNo = 'REF-2026-' + Math.floor(10 + Math.random() * 90);
        lot.refundAmount = lot.quantity * 40;
        lot.refundStatus = 'In Process';
      }
      if (nextStage.id === 'profitability' && !lot.revenue) {
        lot.revenue = lot.invoiceValue;
        lot.expenses = lot.paymentAmount + (lot.transportPayable || 0) + (lot.commissionPayable || 0);
        lot.profitAmount = lot.revenue - lot.expenses;
      }
    }
  }

  saveWorkflowData(lots);
};
