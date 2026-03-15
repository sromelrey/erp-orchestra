# STORY-HR-008 Testing Walkthrough: Employee Onboarding System

## 🔧 Phase 1: Environment Setup & Build Testing

### 1.1 Build the Application
```bash
cd api.orchestra.com
npm run build
```

**Expected:** No compilation errors. Should see "Build successful" message.

### 1.2 Start the Development Server
```bash
npm run start:dev
```

**Expected:** Server starts on port 3000 with no errors.

### 1.3 Verify Database Connection
Check that the database is running and accessible. The application should connect without errors.

---

## 🗄️ Phase 2: Database Migration Testing

### 2.1 Run Migrations
```bash
npm run migrate
```

**Expected:** Migration runs successfully, creating/updating the employee entities.

### 2.2 Verify Database Schema
Check your database to ensure these tables exist and have correct structure:
- `hris.employees`
- `hris.employee_compensations`
- `hris.employee_deductions`
- `hris.compensation_history`

**Expected:** Tables exist with correct column structure including foreign key relationships.

---

## 🔐 Phase 3: Authentication Setup Testing

### 3.1 Create Test User (if needed)
Ensure you have a test user with appropriate permissions:
- `hris.employee.view`
- `hris.employee.create`
- `hris.employee.update`
- `hris.employee.delete`
- `hris.compensation.view`
- `hris.compensation.manage`

### 3.2 Login Test
```bash
# Test login endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Expected:** Returns JWT token and user profile with permissions.

---

## 🎯 Phase 4: Frontend Sidebar Testing

### 4.1 Start Frontend Development Server
```bash
cd portal.orchestra.com
npm run dev
```

**Expected:** Frontend starts on port 3001 (or configured port).

### 4.2 Login to Portal
1. Navigate to `http://localhost:3001/login`
2. Enter test user credentials
3. Click "Sign In"

**Expected:** Successfully authenticated and redirected to dashboard.

### 4.3 Sidebar Navigation Test
1. Click on **Organization** in the sidebar
2. Verify it expands to show submenu items
3. Click on **Employees** submenu
4. Verify it expands to show 4 child items:
   - Employee List
   - Employee Onboarding
   - Compensation
   - Deductions

**Expected:** All submenu items visible and clickable without any 401/403 redirects.

### 4.4 Console Log Verification
Open browser dev tools and check console:
- Should see `[Sidebar] Employees submenu clicked` when clicking Employees submenu
- Should see `[AppSidebar] Debug` (if debug logging is enabled) showing permissions

**Expected:** No JavaScript errors, proper console logs on interactions.

---

## 👥 Phase 5: Employee Onboarding Flow Testing

### 5.1 Navigate to Employee Onboarding
1. Click **Organization** → **Employees** → **Employee Onboarding**
2. Verify page loads without redirect to login

**Expected:** Employee onboarding wizard loads successfully.

### 5.2 Step-by-Step Onboarding Test

#### Step 1: Personal Information
1. Enter valid personal details:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john.doe@example.com"
   - Phone: "+1234567890"
   - Date of Birth: "1990-01-01"
2. Click "Next"

**Expected:** Validates required fields, proceeds to next step.

#### Step 2: Job Details
1. Select existing Branch, Department, Designation
2. Enter hire date: "2024-03-15"
3. Select employment type: "Full-time"
4. Set salary: "50000"
5. Click "Next"

**Expected:** All dropdowns populated with data, validation passes.

#### Step 3: Work Schedule
1. Set work days: Monday-Friday
2. Set work hours: "09:00" to "17:00"
3. Click "Next"

**Expected:** Schedule configured successfully.

#### Step 4: Compensation Setup
1. Select Payment Frequency: "Monthly"
2. Add compensation components:
   - Basic Salary: 50000
   - Housing Allowance: 10000
   - Transport Allowance: 5000
3. Click "Next"

**Expected:** Compensation configured without TypeScript errors.

#### Step 5: Deductions Setup
1. Add deduction items:
   - Tax: 5000
   - Insurance: 2000
   - Pension: 3000
2. Select deduction frequency: "Monthly"
3. Click "Next"

**Expected:** Deductions configured with proper enum types.

#### Step 6: Review & Submit
1. Review all entered information
2. Check that all sections are complete
3. Click "Submit"

**Expected:** Employee created successfully, redirect to employee list.

---

## 📋 Phase 6: Employee List Testing

### 6.1 Navigate to Employee List
1. Click **Organization** → **Employees** → **Employee List**
2. Verify page loads with employee data

**Expected:** Employee list displays with newly created employee.

### 6.2 Search and Filter Test
1. Use search bar to find "John Doe"
2. Test department filter
3. Test status filter

**Expected:** Filters work correctly, search returns relevant results.

### 6.3 Employee Actions Test
1. Click "View" on any employee
2. Click "Edit" on any employee
3. Click "Delete" on a test employee (with confirmation)

**Expected:** All actions work without permission errors.

---

## 💰 Phase 7: Compensation & Deductions Testing

### 7.1 Navigate to Compensation
1. Click **Organization** → **Employees** → **Compensation**
2. Verify page loads with compensation data

**Expected:** Compensation management interface loads.

### 7.2 Navigate to Deductions
1. Click **Organization** → **Employees** → **Deductions**
2. Verify page loads with deduction data

**Expected:** Deductions management interface loads.

---

## 🔍 Phase 8: Error Handling & Edge Cases

### 8.1 Permission Testing
1. Log out and log in with limited permissions
2. Try accessing employee onboarding without `hris.employee.create`

**Expected:** Redirected to unauthorized page or login.

### 8.2 Validation Testing
1. Try submitting onboarding form with empty required fields
2. Try invalid email format
3. Try negative salary values

**Expected:** Proper validation error messages displayed.

### 8.3 Network Error Testing
1. Turn off network during form submission
2. Verify error handling and user feedback

**Expected:** Graceful error handling with retry options.

---

## 📊 Phase 9: Performance & Load Testing

### 9.1 Large Dataset Testing
1. Create 100+ test employees
2. Test employee list pagination
3. Test search performance

**Expected:** Page loads within acceptable time, pagination works.

### 9.2 Concurrent User Testing
1. Open multiple browser tabs with different users
2. Test simultaneous onboarding processes

**Expected:** No race conditions, data integrity maintained.

---

## ✅ Phase 10: Final Acceptance Criteria

### 10.1 Complete Workflow Test
Run the complete employee onboarding workflow from start to finish:
1. Login → Organization → Employees → Employee Onboarding
2. Complete all 6 steps successfully
3. Verify employee appears in employee list
4. Verify compensation and deductions are properly configured

**Expected:** End-to-end workflow completes without errors.

### 10.2 Browser Compatibility Test
Test the application in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected:** Consistent behavior across all browsers.

### 10.3 Mobile Responsiveness Test
1. Test on mobile viewport (using dev tools)
2. Verify sidebar collapses properly
3. Test onboarding wizard on mobile

**Expected:** Responsive design works correctly on mobile devices.

---

## 🐛 Known Issues & Troubleshooting

### Issue: Submenu Not Expanding
**Symptoms:** Clicking Employees doesn't show submenu items
**Solution:** 
1. Check browser console for JavaScript errors
2. Verify user has required permissions
3. Check that `isInitialized` is true in Redux state

### Issue: Redirect to Login on Navigation
**Symptoms:** Navigating to employee pages triggers logout
**Solution:**
1. Check `/auth/me` endpoint is returning 200
2. Verify permissions are correctly loaded
3. Check middleware configuration

### Issue: TypeScript Compilation Errors
**Symptoms:** Build fails with enum type errors
**Solution:**
1. Ensure all enum imports are correct
2. Check `compensationApi.ts` for proper type definitions
3. Verify `EmployeeOnboardingWizard.tsx` uses correct enum types

---

## 📝 Test Results Checklist

- [ ] Build successful without errors
- [ ] Database migrations completed
- [ ] Authentication working correctly
- [ ] Sidebar navigation functional
- [ ] Employee onboarding wizard completes
- [ ] All validation rules working
- [ ] Permission-based access control working
- [ ] Error handling implemented
- [ ] Mobile responsive design working
- [ ] Cross-browser compatibility verified
- [ ] Performance within acceptable limits
- [ ] No security vulnerabilities identified

---

## 🚀 Deployment Readiness

Once all tests pass and the checklist is complete, the employee onboarding system is ready for production deployment.

**Next Steps:**
1. Run final integration tests
2. Update documentation
3. Prepare deployment scripts
4. Schedule production deployment
