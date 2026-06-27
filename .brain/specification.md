# Coal ERP Specification

## Product Goal
Build a Coal Deal Management ERP demo for Jai Bhole Traders that answers one question:

Can the system manage a complete coal deal from auction to profitability?

## Business Firms
- ASAK Coal Pvt. Ltd.
- Jai Bhole Enterprises

## Core Concept
Every coal transaction is tracked through one unique Coal Deal ID.

The Deal ID should connect:
- Firm
- Auction Notification
- EMD
- Bid
- Sale Letter
- Payment Advice
- Government Payment
- UTR
- Application Submission
- Receipt
- DO / Delivery Order
- Lifter
- Lifting Work Order
- Truck Dispatch
- Party Order
- Invoice
- Transport Bill
- Commission
- Collection
- Refund / Lapse
- Profit / Loss
- Documents
- Audit Trail

## User Roles
- Owner / Director
- Accounts Team
- Coal Operations Team
- Auction / Bid Team
- Document Submission Person
- Lifter
- Transport Coordinator
- Billing Team
- Collection Team
- Admin

## Main Dashboard Metrics
- Total Coal Purchased
- Total Coal Lifted
- Total Coal Pending
- Total Coal Sold
- Party Pending Quantity
- DO Expiring Soon
- Government Payment Pending
- EMD Blocked
- EMD Refund Pending
- Lapse Refund Pending
- Customer Collection Pending
- Transport Payable
- Commission Payable
- Firm-wise Profit
- Deal-wise Profit
- Today’s Lifting
- Today’s Dispatch
- Delayed DO
- Delayed Customer Orders
- Pending Documents
- Pending Approvals

## Dashboard Filters
- Firm
- Mine
- Coal Company
- Customer
- DO Number
- Date Range
- Deal Status
- Lifter
- Transporter

## Module List
The source PDF defines 34 modules:
1. Firm Master
2. Coal Company / Source Master
3. Mine Master
4. Coal Grade Master
5. Auction Notification
6. EMD Management
7. Bid Management
8. Sale Letter
9. Payment Advice
10. Government Payment
11. Application Submission
12. Delivery Order / DO Management
13. Lifter Management
14. Lifting Work Order
15. Truck Dispatch / Lifting Tracker
16. Party / Customer Master
17. Customer Order / Sales Order
18. DO Allocation to Customer
19. Invoice / Billing
20. Collection Management
21. Transport Management
22. Commission / Broker Management
23. Lapse / Refund Management
24. Third Party Coal Management
25. Market Coal Purchase
26. Stock / Quantity Position
27. Profitability
28. Document Vault
29. Task & Reminder System
30. Alert Engine
31. Approval Workflow
32. Audit Trail
33. Reports
34. Entry Testing / Sample Data

## Demo Data Requirement
Use a single flow and keep it locally stored.

Primary demo deal:
- Deal ID: `DEAL-2026-001`
- Firm: ASAK Coal Pvt. Ltd.
- Source: SECL
- Mine: Kusmunda
- Grade: G10
- Quantity: 10,000 MT
- EMD: ₹25,00,000
- Bid Rate: ₹4,200/MT
- Bid Result: Won
- Payment Advice: ₹4,20,00,000
- Net Payment: ₹3,95,00,000
- Lifter: ABC Lifter
- Customer: XYZ Sponge Pvt Ltd

Second sample flow:
- Firm: Jai Bhole Enterprises
- Transaction Type: Third Party Government Coal
- Quantity: 3,000 MT
- Handling Commission: ₹50/MT

## Required UX Expectations
- Clean ERP dashboard
- Left sidebar navigation
- Quick Add button
- Deal ID search bar
- Firm filter always visible
- Status badges
- Red for delays or expiry
- Green for completed
- Yellow for pending
- Mobile-friendly forms
- Excel import / export
- PDF uploads
- Role-wise access
- All modules connected

## Most Important Screen
Deal 360 View should show:
- Basic deal details
- Firm
- Source
- Mine
- Grade
- Quantity
- Financial summary
- EMD
- Sale Letter
- Payment
- DO
- Lifting
- Dispatch
- Customer sales
- Collection
- Transport
- Commission
- Refund / Lapse
- Profit
- Documents
- Tasks
- Audit Trail

## Demo Flow
Auction -> EMD Paid -> Bid Won -> Sale Letter -> Payment Advice -> Government Payment -> Application Submitted -> Delivery Order -> Lifter Assigned -> Truck Dispatch -> Customer Order -> Invoice -> Collection -> Transport Payment -> Profit Calculation

## Design Constraints
- Do not rebuild the layout shell.
- Do not change the CSS system in this phase.
- Do not add backend complexity.
- Prefer lightweight pages that demonstrate the concept rather than full CRUD depth.
- Keep the first implementation centered on the current app shell and route map.
