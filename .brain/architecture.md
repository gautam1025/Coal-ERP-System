# Target Architecture

## Architectural Direction
This repo is being refactored from an older fuel/vehicle workflow into a coal ERP demo that is driven by local static data and route-based screens.

The first implementation should prioritize:
- route structure
- reusable page shell
- the Deal 360 narrative
- local data files
- keeping the existing layout intact

## Current Shell Strategy
Keep these untouched unless a batch explicitly needs them:
- `src/app/layout.jsx`
- `src/app/providers.jsx`
- `src/components/*`
- CSS and styling tokens already present

Use `src/App.jsx` as the progress checkpoint after each batch.

## Target Route Groups
The future route map should be organized as:
- `/dashboard`
- `/masters/*`
- `/deal/DEAL-2026-001`
- `/workflow/*`
- `/operations/*`
- `/sales/*`
- `/finance/*`
- `/support/*`
- `/settings`

## Recommended File Domains
### Core shell
- `src/App.jsx`
- `src/app/routes.jsx`
- `src/app/layout.jsx`
- `src/app/providers.jsx`
- `src/main.jsx`

### Local data
Create compact JSON-like JS modules such as:
- `src/data/deals.js`
- `src/data/masters.js`
- `src/data/dashboard.js`
- `src/data/finance.js`
- `src/data/operations.js`
- `src/data/sales.js`
- `src/data/reports.js`

### Pages
Create lightweight modules grouped by function:
- `src/pages/dashboard/Dashboard.jsx`
- `src/pages/coal/Deal360.jsx`
- `src/pages/masters/*`
- `src/pages/workflow/*`
- `src/pages/operations/*`
- `src/pages/sales/*`
- `src/pages/finance/*`
- `src/pages/support/*`

## Page Pattern
Each module page should follow the same structure:
- Page header
- Summary cards
- Search / filter bar if useful
- Table or list
- Details card
- Small workflow note or timeline snippet

## Data Pattern
Use one shared demo deal across the app.

Keep data in local JS files with stable IDs and predictable shapes so pages can import the same references:
- deal identity
- financials
- operations status
- customer sales
- transport and commission
- tasks and alerts

## Component Strategy
Reuse the existing generic components where they fit:
- `MetricCard`
- `StatusTag`
- `TableWrapper`
- `ModalWrapper`
- existing modal patterns if needed later

Do not create a wide new component library unless a batch requires it.

## Batch Strategy
All work should follow the batch rule already established in `COAL_ERP_IMPLEMENTATION_PLAN.md`:
- at most 5 files per batch
- include `src/App.jsx` in each batch
- stop after each batch and wait for approval

## Implementation Priority
1. Reset route map to coal ERP screens
2. Add local demo data
3. Build Dashboard and Deal 360
4. Add master data screens
5. Add auction-to-payment flow
6. Add delivery, lifting, dispatch, and sales flow
7. Add finance, profitability, support modules, and reports

## Current Validation Goal
The app is considered on track if a user can open the dashboard and then open the Deal 360 page for `DEAL-2026-001` without needing backend data or a layout rewrite.
