# Implementation Plan: STORY-HR-006 (Pay Periods & Timesheet Processing)

This plan outlines the integration of automated timesheet aggregation and management within the HRIS module.

## 1. Overview
Convert raw attendance logs (`TimeEvent`) into structured `Timesheets` for specific `PayPeriods`.

## 2. API & Permissions
The backend controllers are secured using the "Double-Gated" security model:
- **Feature Gate**: Requires `HRIS` module access.
- **Permission Gate**: 
  - `hris.payroll.view` / `hris.payroll.manage` (for Pay Periods)
  - `hris.timesheet.view` / `hris.timesheet.manage` (for Timesheets)

## 3. Implementation Checklist

### [Phase A] Foundation & Entities
- [x] Create `PayPeriod` entity.
- [x] Create `Timesheet` and `TimesheetDay` entities.
- [x] Register entities in `migration-database.config.ts`.
- [x] Generate and run database migrations.

### [Phase B] Service Logic
- [x] Implement `PayPeriodsService` (CRUD).
- [x] Implement `TimesheetsService.generate()`:
  - [x] Group attendance logs by Employee/Date.
  - [x] Calculate regular vs. overtime hours (threshold: 8h).
  - [x] Flag anomalies (missing clock-in/out).
  - [x] Handle refreshes (idempotent regeneration).
- [x] Implement Status State Machine (Draft -> Pending Review -> Approved -> Locked).

### [Phase C] Portal Frontend
- [x] Implement RTK Query slices (`payPeriodsApi`, `timesheetsApi`).
- [x] Create **Pay Period Management** UI (`/hris/pay-periods`).
- [x] Create **Timesheet Directory** UI (`/hris/timesheets`):
  - [x] Period Selector.
  - [x] Manual Trigger for Aggregation Refresh.
  - [x] Status Badge System.
  - [x] Summary Stat Cards (Total, Approved, Anomalies).
- [x] Update Sidebar Navigation.

## 4. ✅ COMPLETED IMPLEMENTATION

### [Phase D] Automated Cron Job (NEWLY COMPLETED)
- [x] Implement `TimesheetGenerationService` with retry logic and error handling
- [x] Implement `TimesheetCronService` using NestJS @nestjs/schedule
- [x] Create `JobExecutionLog` entity for monitoring and debugging
- [x] Add job execution tracking fields to `PayPeriod` entity
- [x] Implement manual trigger endpoint for urgent processing
- [x] Create job status monitoring UI following EntityManager pattern
- [x] Add comprehensive error handling with 3-retry logic
- [x] Implement in-app notification system (placeholder)
- [x] Add proper TypeScript types and RBAC permissions
- [x] Create database migration for new schema changes

## 5. Next Steps & Technical Debt
- [ ] Implement `TimesheetDetailView` (Daily breakdown showing raw logs vs. aggregated hours).
- [ ] Implement `TimesheetAdjustments` (Manual hour overrides by managers).
- [x] Automated Cron Job for end-of-period generation. ✅ **COMPLETED**

## 6. 🎉 STORY-HR-006 STATUS: COMPLETE

All core functionality for automated timesheet generation and processing has been successfully implemented and tested. The system now provides:
- ✅ Automated daily processing at 2:00 AM
- ✅ Manual trigger capability for urgent processing
- ✅ Real-time job monitoring and status tracking
- ✅ Comprehensive error handling and retry logic
- ✅ Full frontend integration with proper permissions
- ✅ Production-ready database schema and logging
