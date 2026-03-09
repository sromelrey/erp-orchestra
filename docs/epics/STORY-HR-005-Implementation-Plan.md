# STORY-HR-005: Time Tracking & Leave Core Implementation Plan

This document outlines the implementation plan for the first story of EPIC-04, covering foundational attendance and leave management.

## 📋 Status
- **Story ID**: STORY-HR-005
- **Priority**: High
- **Status**: 📋 Planned
- **Dependencies**: EPIC-03 (HRIS Core)

---

## 🏗️ 1. Backend Design (api.orchestra.com)

### 🧱 Entities
- **Location**: `hris` schema.
- **`TimeEvent`**:
    - `id`: UUID / Primary Key
    - `employee_id`: FK -> Employee
    - `type`: Enum (CLOCK_IN, CLOCK_OUT)
    - `timestamp`: DateTime
    - `location`: JSON (Lat, Lng, Accuracy)
    - `ip_address`: String
    - `device_info`: String
    - `tenant_id`: FK -> Tenant
- **`LeaveType`**:
    - `id`: Int / Identity
    - `name`: String (e.g., Annual Leave)
    - `is_paid`: Boolean
    - `default_days`: Int
- **`LeaveRequest`**:
    - `id`: UUID
    - `employee_id`: FK -> Employee
    - `leave_type_id`: FK -> LeaveType
    - `start_date`: Date
    - `end_date`: Date
    - `reason`: Text
    - `status`: Enum (PENDING, APPROVED, REJECTED)
    - `approved_by_id`: FK -> Employee (Manager)

### 🛠️ API Endpoints
- **Attendance**:
    - `POST /v1/hris/attendance/clock-in`: Record a new in-event.
    - `POST /v1/hris/attendance/clock-out`: Record a new out-event.
    - `GET /v1/hris/attendance/status`: Return current day's clock status.
- **Leave**:
    - `CRUD /v1/hris/leave-types`: Manage available leave configurations (HR Admin).
    - `POST /v1/hris/leave-requests`: Submit a new request.
    - `GET /v1/hris/leave-requests`: List requests (filtered by role: own for employee, team for manager).
    - `PATCH /v1/hris/leave-requests/:id/approve`: Set status to Approved.

---

## 🎨 2. Frontend Design (portal.orchestra.com)

### 🧩 Components & Pages
- **`TimeClockWidget`**: 
    - Floating or Dashboard card with button.
    - Display current duration if clocked in.
    - Captures geolocation on click.
- **`LeaveTypeManager`**:
    - `app/(main)/hris/leave-types/page.tsx` using `EntityManager`.
- **`LeaveRequestDirectory`**:
    - `app/(main)/hris/leave-requests/page.tsx` using `EntityManager`.
    - Custom row actions for Approval/Rejection.

### 📐 Standards Enforcement
- **Components**: Follow `docs/frontend/component-guidelines.md`.
- **Naming**: `PascalCase` for components, `kebab-case` for directories.
- **SearchableSelect**: Use for `LeaveType` selection in the request form.
- **Backend Schema**: Use `hris` schema as per `docs/backend/naming.md`.
- **Guard**: All routes protected by `PermissionGuard`.

---

## 🚀 3. Branch Strategy
**Branch Name**: `feat/hris/st-attendance-leave-core`

---

## ✅ 4. Definition of Done
1. Employee can successfully Clock In with location data.
2. Clock Status is persisted across sessions.
3. Employee can submit a Leave Request and see it as 'Pending'.
4. HR/Manager can approve the request, updating the status.
5. All endpoints are secured with tenant-aware RBAC.
