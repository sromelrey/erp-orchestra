# EPIC-08-5: Financial Integration

## 🎯 Objective
Integrate sales invoice generation with sales orders and implement basic financial tracking

## 📊 Status
**Status:** Planning  
**Priority:** MEDIUM  
**Target Completion:** Week 5  
**Module:** Finance / Sales  

---

## 📋 Stories

### Story: Sales Invoice Integration
**ID:** MRP-006  
**Points:** 8  
**Status:** To Do  

**Description:**
Integrate sales invoice generation with sales orders and implement payment tracking

**Acceptance Criteria:**
- [ ] Auto-generate invoice from sales order
- [ ] Invoice list page (`/sales/invoices`)
- [ ] Payment tracking functionality
- [ ] Customer account statements
- [ ] Invoice PDF generation
- [ ] Tax calculations
- [ ] Multiple payment support
- [ ] Credit note handling
- [ ] Aging reports
- [ ] Invoice approval workflow

**Technical Tasks:**
- [ ] Connect sales orders to invoice module
- [ ] Create invoice automation logic
- [ ] Build invoice frontend pages
- [ ] Implement payment tracking
- [ ] Add tax calculation service
- [ ] Create invoice templates

**Dependencies:**
- Inventory Transactions (EPIC-08-2)
- Existing Finance module

---

## 🗂️ File Structure

### Backend
```
src/modules/finance/
├── sales-invoice/
│   ├── sales-invoice.controller.ts (enhance)
│   ├── sales-invoice.service.ts (enhance)
│   ├── invoice.entity.ts (update)
│   └── dto/
├── payments/
│   ├── payment.controller.ts
│   ├── payment.service.ts
│   └── payment.entity.ts
├── customer-accounts/
│   ├── customer-account.service.ts
│   └── aging-report.service.ts
└── services/
    ├── tax-calculation.service.ts
    └── invoice-generation.service.ts
```

### Frontend
```
app/(main)/sales/
├── invoices/
│   ├── page.tsx
│   ├── create/page.tsx
│   ├── [id]/
│   │   ├── page.tsx
│   │   ├── payment/page.tsx
│   │   └── print/page.tsx
│   └── credit-notes/
│       ├── page.tsx
│       └── create/page.tsx
├── customers/
│   ├── page.tsx
│   ├── [id]/
│   │   ├── page.tsx
│   │   └── statement/page.tsx
│   └── aging-report/page.tsx
└── payments/
    ├── page.tsx
    └── receive/page.tsx
```

---

## 🔄 Workflow

1. Sales Order is confirmed
2. Generate invoice (auto or manual)
3. Invoice goes through approval
4. Send invoice to customer
5. Record payments
6. Update customer account
7. Generate statements

---

## 📊 Data Model

```sql
-- Enhanced Invoice Structure
CREATE TABLE sales_invoices (
    id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) UNIQUE NOT NULL,
    sales_order_id INTEGER,
    customer_id INTEGER NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'DRAFT', -- DRAFT, APPROVED, SENT, PAID, OVERDUE, CANCELLED
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    notes TEXT,
    approved_by INTEGER,
    approved_at TIMESTAMP,
    sent_at TIMESTAMP
);

CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL,
    sales_order_item_id INTEGER,
    item_id INTEGER NOT NULL,
    description TEXT,
    quantity DECIMAL(15,6) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(12,2) NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_no VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INTEGER,
    customer_id INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50), -- CASH, BANK, CHECK, CARD
    amount DECIMAL(12,2) NOT NULL,
    reference_no VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customer_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    total_invoiced DECIMAL(12,2) DEFAULT 0,
    total_paid DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) GENERATED ALWAYS AS (total_invoiced - total_paid) STORED,
    credit_limit DECIMAL(12,2) DEFAULT 0,
    last_payment_date DATE,
    last_invoice_date DATE
);
```

---

## 🎯 Key Features

### Invoice Management
- Auto-generation from sales orders
- Invoice templates and customization
- Tax calculations
- Multi-currency support (future)

### Payment Tracking
- Payment allocation
- Partial payments
- Payment reminders
- Aging analysis

### Customer Accounting
- Account statements
- Credit management
- Aging reports
- Payment history

---

## ✅ Definition of Done
- Invoices generate automatically from sales orders
- Tax calculations are accurate
- Payments are properly allocated
- Customer statements are correct
- Aging reports are accurate
- Invoice PDFs are properly formatted
- Payment workflow is functional
