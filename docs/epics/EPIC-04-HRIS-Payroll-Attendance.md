# EPIC-04: HRIS Attendance, Leave & Payroll

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-04 |
| **Epic Name** | HRIS Attendance, Leave & Payroll |
| **Status** | � Implementing |
| **Priority** | High |
| **Dependencies** | EPIC-01, EPIC-02, EPIC-03 (HRIS Core) |

---

## 🎯 Purpose
To provide comprehensive time tracking, leave management, and automated payroll processing for the HRIS module. This epic builds upon the `Employee` master data established in EPIC-03, introducing time-series data generation, manager approvals, and financial calculations for payslips.

---

## 🏗️ Architecture & Entities

### Core Entities
1. **Attendance (Time Events)**: Raw clock-in/out logs capturing when and where an employee worked.
2. **Leave Management**: Configuration of leave types (Vacation, Sick) and the employee requests for time off.
3. **Timesheets**: Aggregations of daily `TimeEvents` into pay periods, resolving regular vs. overtime hours, handling adjustments and system anomalies.
4. **Compensation & Deductions**: Base rates for employees and recurring/variable deductions.
5. **Payslips**: The final calculated financial document representing an employee's earnings and deductions for a closed pay period.

---

## 📝 Stories & Implementation Plan

### 📌 PHASE 1: Attendance & Leave System

| Story ID | STORY-HR-005 |
|----------|--------------|
| **Name** | Time Tracking & Leave Core |
| **Type** | Full Stack |

**Description:**
Implement the backend entities and frontend portal for employees to log time and request leaves, and for HR to configure them.

**Tasks:**
- [x] Create `TimeEvent`, `LeaveType`, and `LeaveRequest` entities.
- [x] Develop API endpoints for employees to clock in/out (recording timestamp, IP, device).
- [x] Build the **Time Clock** UI component for the employee dashboard.
- [x] Implement robust leave balance calculation and approval workflows for Managers.
- [x] Create UI management pages for HR to define `LeaveTypes` and review `LeaveRequests`.

---

### 📌 PHASE 2: Timesheet Aggregation & Approvals

| Story ID | STORY-HR-006 |
|----------|--------------|
| **Name** | Pay Periods & Timesheet Processing |
| **Type** | Full Stack |

**Description:**
Build the engine that converts raw attendance data and approved leaves into structured, daily timesheets ready for payroll.

**Tasks:**
- [x] Create `PayPeriod`, `Timesheet`, `TimesheetDay`, `TimesheetAdjustment`, and `TimesheetAnomaly` entities.
- [ ] Develop a chron/service worker to automatically generate `Timesheets` at the end of a `PayPeriod`.
- [x] Implement logic to automatically flag anomalies (e.g., missing clock-out).
- [x] Build the **Timesheet Review UI** for managers to view, adjust, and approve employee timesheets.
- [x] Enforce strict state machine constraints (Draft -> Pending Review -> Approved -> Locked).

---

### 📌 PHASE 3: Compensation & Deductions Management

| Story ID | STORY-HR-007 |
|----------|--------------|
| **Name** | Salary & Deduction Configuration |
| **Type** | Backend/Frontend |

**Description:**
Set up the financial baseline for employees required to calculate net pay.

**Tasks:**
- [ ] Create `EmployeeCompensation` and `Deduction` entities.
- [ ] Add the "Compensation" tab to the Employee Profile UI (from EPIC-03).
- [ ] Implement history tracking for rate changes (effective dates).
- [ ] Build APIs for HR to assign recurring deductions (e.g., health insurance, loan repayments).

---

### 📌 PHASE 4: Payroll Processing Layer

| Story ID | STORY-HR-008 |
|----------|--------------|
| **Name** | Payslip Generation Engine |
| **Type** | Full Stack |

**Description:**
The culmination of the HR module: taking approved timesheets and employee compensation to generate final payslips.

**Tasks:**
- [ ] Create `Payslip` and `PayslipItem` entities.
- [ ] Develop the **Payroll Run** service that calculates Gross Pay, subtracts Deductions, and yields Net Pay.
- [ ] Implement the **Payroll Dashboard UI** for HR to preview, confirm, and publish payslips.
- [ ] Build the **Employee Payslip Portal** for staff to view and download PDF versions of their earnings.

---

## 🔒 Security & RBAC Requirements

These permissions expand on the HRIS role capabilities:

**Time & Leave:**
- `hris.attendance.log` (Employee self-serve)
- `hris.leave.request` (Employee self-serve)
- `hris.leave.manage` (Manager/HR approval)

**Timesheets:**
- `hris.timesheet.view`
- `hris.timesheet.manage` (Manager adjustments/approvals)

**Payroll (Highly Restricted):**
- `hris.compensation.view`
- `hris.compensation.manage`
- `hris.payroll.run`
- `hris.payslip.view_own` (Employee self-serve)

---

## ✅ Definition of Done
1. Employees can clock in/out and request leaves from their portal.
2. The system correctly aggregates time events into daily and period-level timesheets.
3. Managers can approve timesheets and leave requests.
4. HR can define pay periods and run a full payroll cycle yielding correct payslips.
5. All calculations properly track the tenant scope and respect the strict RBAC permission layers.
