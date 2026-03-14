# STORY-HR-007 Testing Walkthrough

## Compensation & Deductions Management

### 📋 Overview

This testing guide covers the complete frontend implementation of STORY-HR-007 (Compensation & Deductions Management). The implementation includes standalone management pages, employee profile integration, and proper RBAC permissions.

---

## 🧪 Test Environment Setup

### Prerequisites

1. **Backend API**: Ensure the compensation/deductions API endpoints are running
2. **Database**: Have test employees with IDs 1, 2, 3 available
3. **Permissions**: Test user should have `hris.compensation.view` and `hris.compensation.manage` permissions
4. **Frontend**: Portal should be running in development mode

### Test Data Requirements

- Employee ID: 1 (Test Employee)
- Employee ID: 2 (Second Test Employee)
- Employee ID: 3 (Third Test Employee)

---

## 🎯 Test Cases

### 1. Compensation Management Page (`/hris/compensation`)

#### 1.1 Page Access & Navigation

- **Test**: Navigate to `/hris/compensation`
- **Expected**: Page loads with employee selector dropdown
- **Expected**: Permission guard allows access with proper permissions
- **Expected**: Page title shows "Compensation Management"
- **Expected**: Description shows "Manage employee compensation records and salary structures"

#### 1.2 Employee Selector

- **Test**: Click employee dropdown
- **Expected**: Shows options for Employee 1, Employee 2, Employee 3
- **Test**: Select different employee
- **Expected**: Data refreshes for selected employee
- **Expected**: Loading state shows during data fetch

#### 1.3 Stats Cards

- **Test**: View stats cards at top
- **Expected**: "Total Records" shows count of compensation records
- **Expected**: "Active Compensation" shows count of active records
- **Expected**: "Inactive Records" shows count of inactive records
- **Expected**: "Total Base Salary" shows sum of all base salaries with peso sign (₱)

#### 1.4 Data Table

- **Test**: View compensation records table
- **Expected**: Shows columns: Employee, Base Salary, Hourly Rate, Overtime Rate, Currency, Payment Frequency, Effective Date, End Date, Status, Actions
- **Expected**: Empty state shows when no records exist
- **Expected**: Search functionality filters records
- **Expected**: All monetary values display with peso sign (₱)

#### 1.5 Create Compensation Record

- **Test**: Click "Create" button
- **Expected**: Form modal opens with fields:
  - Base Salary (number, optional)
  - Hourly Rate (number, optional)
  - Overtime Rate (number, default 1.5)
  - Currency (select, default USD)
  - Payment Frequency (select, default Monthly)
  - Effective Date (date, required)
  - End Date (date, optional)
  - Change Reason (textarea, optional)
- **Test**: Fill form with valid data and submit
- **Expected**: Success toast shows "Compensation record created successfully"
- **Expected**: Table refreshes with new record
- **Expected**: Stats cards update
- **Expected**: Amounts display with peso sign (₱)

#### 1.6 Edit Compensation Record

- **Test**: Click edit icon on existing record
- **Expected**: Form modal opens with current data populated
- **Test**: Modify fields and submit
- **Expected**: Success toast shows "Compensation record updated successfully"
- **Expected**: Table updates with modified record

#### 1.7 Delete Compensation Record

- **Test**: Click delete icon on existing record
- **Expected**: Confirmation dialog appears
- **Test**: Confirm deletion
- **Expected**: Success toast shows "Compensation record deleted successfully"
- **Expected**: Record removed from table

#### 1.8 View Compensation Record

- **Test**: Click view icon on existing record
- **Expected**: Form modal opens in read-only mode
- **Expected**: No submit button, only close button

---

### 2. Deductions Management Page (`/hris/deductions`)

#### 2.1 Page Access & Navigation

- **Test**: Navigate to `/hris/deductions`
- **Expected**: Page loads with employee selector dropdown
- **Expected**: Page title shows "Deductions Management"
- **Expected**: Description shows "Manage employee deduction records and payroll deductions"

#### 2.2 Stats Cards

- **Test**: View stats cards
- **Expected**: "Total Deductions" shows count of deduction records
- **Expected**: "Active Deductions" shows count of active records
- **Expected**: "Inactive Deductions" shows count of inactive records
- **Expected**: "Total Deduction Amount" shows sum of all deduction amounts

#### 2.3 Data Table

- **Test**: View deductions table
- **Expected**: Shows columns: Employee, Name, Type, Amount, Percentage, Frequency, Effective Date, End Date, Status, Actions
- **Expected**: Type badges show: Fixed, Percentage, Recurring, Variable
- **Expected**: Frequency badges show: One-Time, Monthly, Quarterly, Annually

#### 2.4 Create Deduction Record

- **Test**: Click "Create" button
- **Expected**: Form modal opens with fields:
  - Deduction Name (text, required)
  - Deduction Type (select: Fixed Amount, Percentage, Recurring, Variable)
  - Amount (number, optional)
  - Percentage (number, optional)
  - Frequency (select: One-Time, Monthly, Quarterly, Annually)
  - Effective Date (date, required)
  - End Date (date, optional)
  - Description (textarea, optional)
- **Test**: Fill form and submit
- **Expected**: Success toast shows "Deduction record created successfully"
- **Expected**: Amount displays with peso sign (₱) in table

#### 2.5 Edit/Delete Deduction Record

- **Test**: Test edit and delete operations similar to compensation
- **Expected**: Proper success/error handling
- **Expected**: Data refreshes after operations

---

### 3. Employee Profile Integration

#### 3.1 Compensation Section

- **Test**: Navigate to `/hris/employees/[id]` for any employee
- **Expected**: "Compensation & Deductions" section appears
- **Expected**: Shows Base Salary from active compensation record with peso sign (₱)
- **Expected**: Shows Hourly Rate from active compensation record with peso sign (₱)
- **Expected**: Shows count of Active Deductions
- **Expected**: Shows "Not Set" if no compensation data exists

#### 3.2 Data Integration

- **Test**: Create compensation record for employee
- **Expected**: Profile page shows updated salary information
- **Test**: Create deduction record for employee
- **Expected**: Profile page shows updated deduction count

---

### 4. Sidebar Navigation

#### 4.1 Menu Items

- **Test**: Check sidebar menu
- **Expected**: "Compensation" menu item appears with DollarSign icon
- **Expected**: "Deductions" menu item appears with Target icon
- **Expected**: Both items have proper permission gating

#### 4.2 Navigation Flow

- **Test**: Click "Compensation" menu item
- **Expected**: Navigates to `/hris/compensation`
- **Test**: Click "Deductions" menu item
- **Expected**: Navigates to `/hris/deductions`

---

### 5. Permission Testing

#### 5.1 View Permission

- **Test**: User with only `hris.compensation.view` permission
- **Expected**: Can view both compensation and deductions pages
- **Expected**: Cannot see create/edit/delete buttons
- **Expected**: Can access employee profile compensation section

#### 5.2 Manage Permission

- **Test**: User with `hris.compensation.manage` permission
- **Expected**: Can perform all CRUD operations
- **Expected**: All action buttons are visible and functional

#### 5.3 No Permission

- **Test**: User without compensation permissions
- **Expected**: Cannot access compensation/deductions pages
- **Expected**: Redirected or shown access denied
- **Expected**: Menu items hidden in sidebar

---

### 6. Error Handling

#### 6.1 API Errors

- **Test**: Simulate API failure during create/update/delete
- **Expected**: Error toast shows meaningful message
- **Expected**: Form remains open for correction
- **Expected**: No data corruption occurs

#### 6.2 Validation Errors

- **Test**: Submit form with missing required fields
- **Expected**: Form validation prevents submission
- **Test**: Submit invalid data (negative numbers, invalid dates)
- **Expected**: Proper validation messages appear

#### 6.3 Network Errors

- **Test**: Disconnect network during operations
- **Expected**: Proper error handling and user feedback
- **Expected**: No hanging loading states

---

### 7. Responsive Design

#### 7.1 Mobile View

- **Test**: View pages on mobile viewport
- **Expected**: Tables adapt to mobile layout
- **Expected**: Forms remain usable on mobile
- **Expected**: Stats cards stack properly

#### 7.2 Tablet View

- **Test**: View on tablet viewport
- **Expected**: Proper layout adjustments
- **Expected**: All functionality remains accessible

---

### 8. Performance Testing

#### 8.1 Loading States

- **Test**: Check loading indicators
- **Expected**: Skeleton loaders during data fetch
- **Expected**: Loading states on form submission
- **Expected**: No jarring transitions

#### 8.2 Large Data Sets

- **Test**: Test with many compensation/deduction records
- **Expected**: Table remains performant
- **Expected**: Search functionality works efficiently
- **Expected**: Stats calculate correctly

---

## 🐛 Known Issues & Edge Cases

### Form Validation

- **Issue**: Form may accept invalid date ranges (end date before effective date)
- **Test**: Verify date validation logic

### Data Consistency

- **Issue**: Multiple active compensation records may exist
- **Test**: Verify backend prevents overlapping active periods

### Currency Handling

- **Issue**: Currency symbols may not format correctly for all locales
- **Test**: Test different currency selections

---

## ✅ Success Criteria

### Must Pass

- [ ] All CRUD operations work for both compensation and deductions
- [ ] Permission gating works correctly
- [ ] Employee profile integration shows correct data
- [ ] Sidebar navigation works properly
- [ ] Error handling provides user feedback
- [ ] Forms validate correctly

### Should Pass

- [ ] Responsive design works on mobile/tablet
- [ ] Performance is acceptable with large datasets
- [ ] Loading states provide good UX
- [ ] Search and filtering work efficiently

### Nice to Have

- [ ] Accessibility features (keyboard navigation, screen readers)
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Bulk operations

---

## 📝 Test Results Template

```
### Test Session: [Date]
### Tester: [Name]
### Environment: [Dev/Staging/Prod]

#### Compensation Management
- [ ] Page Load & Navigation
- [ ] Employee Selector
- [ ] Stats Cards
- [ ] Data Table
- [ ] Create Record
- [ ] Edit Record
- [ ] Delete Record
- [ ] View Record

#### Deductions Management
- [ ] Page Load & Navigation
- [ ] Stats Cards
- [ ] Data Table
- [ ] Create Record
- [ ] Edit Record
- [ ] Delete Record

#### Employee Profile Integration
- [ ] Compensation Section
- [ ] Data Integration

#### Sidebar Navigation
- [ ] Menu Items
- [ ] Navigation Flow

#### Permissions
- [ ] View Permission
- [ ] Manage Permission
- [ ] No Permission

#### Error Handling
- [ ] API Errors
- [ ] Validation Errors
- [ ] Network Errors

#### Responsive Design
- [ ] Mobile View
- [ ] Tablet View

#### Performance
- [ ] Loading States
- [ ] Large Data Sets

### Issues Found:
1. [Issue description]
2. [Issue description]

### Overall Status: [PASS/FAIL/PARTIAL]
```

---

## 🚀 Next Steps

After completing these tests:

1. Fix any identified issues
2. Run automated tests if available
3. Perform UAT with actual HR users
4. Deploy to staging environment
5. Plan production rollout

This comprehensive testing walkthrough ensures the STORY-HR-007 implementation meets all functional and non-functional requirements before production deployment.
