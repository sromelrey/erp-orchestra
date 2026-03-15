# HRIS Settings Frontend

This item tracks the missing HRIS Settings page in the portal where admins can manage compensation brackets and statutory deductions (e.g., SSS, PhilHealth, Pag-IBIG, custom deductions).

## Gap
- No HRIS settings surface in the portal for configuring compensation/deduction tables.
- Admins cannot self-serve updates to brackets; changes require backend or data fixes.

## Impact
- Blocks payroll accuracy and compliance self-service.
- Increases manual ops and risk of stale deduction rates.

## Proposed Approach
1) **Navigation**
   - Add sidebar entry under Settings → HRIS Settings (portal app).
   - Route: `/settings/hris` (SSR/client as per existing app patterns).

2) **Page Layout**
   - Sections: Compensation Brackets, Statutory Deductions (SSS/PhilHealth/Pag-IBIG), Other Deductions (custom).
   - Use tabs or cards for each section; include data tables with CRUD and import/export buttons.

3) **Data Sources**
   - Backed by HRIS APIs (to be confirmed/created):
     - GET/POST/PUT/DELETE compensation brackets
     - GET/POST/PUT/DELETE deduction tables
     - Optional bulk import/export endpoints for rate tables

4) **CRUD Flows**
   - List with pagination/search.
   - Create/edit modal with validation (amount thresholds, effective dates).
   - Soft delete or archive where applicable.

5) **RBAC & Guardrails**
   - Restrict to HR/Payroll admin roles; hide nav if lacking permission.
   - Audit trail hooks where available.

6) **UX Notes**
   - Show effective date ranges and versioning (e.g., "effective from" labels).
   - Provide inline hints for statutory rates and references.

7) **Technical Tasks**
   - Add page at `app/settings/hris/page.tsx` with layout + wiring to API hooks.
   - Create hooks/services for HRIS settings APIs.
   - Add forms/tables using existing UI kit (cards, tables, modals, tabs).
   - Add loading/error states and toast feedback.

## Definition of Done
- HRIS Settings page reachable via sidebar.
- Admins can view and manage compensation brackets and statutory deductions.
- RBAC enforced; unauthorized users do not see or access the page.
- Validations prevent invalid ranges; errors surfaced clearly.
