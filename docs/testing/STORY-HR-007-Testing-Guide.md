# STORY-HR-007 Testing Walkthrough: Compensation & Deductions System

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

**Expected:** Migration runs successfully, creating the compensation entities.

### 2.2 Verify Database Schema
Check your database to ensure these tables were created:
- `hris.employee_compensations`
- `hris.employee_deductions`
- `hris.compensation_history`

**Expected:** Tables exist with correct column structure.

---

## 🔐 Phase 3: Authentication Setup Testing

### 3.1 Create Test User (if needed)
Ensure you have a test user with appropriate permissions:
- `hris.compensation.view`
- `hris.compensation.manage`

### 3.2 Get Authentication Token
```bash
# Login to get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected:** Receive JWT token in response.

---

## 💰 Phase 4: Compensation API Testing

### 4.1 Create Employee Compensation
```bash
curl -X POST http://localhost:3000/hris/employees/1/compensation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 50000,
    "effectiveDate": "2024-01-01",
    "currency": "USD",
    "paymentFrequency": "monthly",
    "changeReason": "Initial salary setup"
  }'
```

**Expected:** HTTP 201, compensation record created.

### 4.2 Get Employee Compensation
```bash
curl -X GET http://localhost:3000/hris/employees/1/compensation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** HTTP 200, returns array of compensation records.

### 4.3 Update Compensation
```bash
curl -X PUT http://localhost:3000/hris/employees/1/compensation/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 55000,
    "changeReason": "Annual review increase"
  }'
```

**Expected:** HTTP 200, compensation updated.

### 4.4 Calculate Compensation
```bash
curl -X GET "http://localhost:3000/hris/employees/1/compensation/calculate/2024-06-15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** HTTP 200, returns current compensation for that date.

---

## 💸 Phase 5: Deductions API Testing

### 5.1 Create Employee Deduction
```bash
curl -X POST http://localhost:3000/hris/employees/1/deductions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Health Insurance",
    "type": "fixed",
    "amount": 150,
    "frequency": "monthly",
    "effectiveDate": "2024-01-01",
    "description": "Company health insurance premium"
  }'
```

**Expected:** HTTP 201, deduction record created.

### 5.2 Get Employee Deductions
```bash
curl -X GET http://localhost:3000/hris/employees/1/deductions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** HTTP 200, returns array of deduction records.

### 5.3 Update Deduction
```bash
curl -X PUT http://localhost:3000/hris/employees/1/deductions/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 175,
    "description": "Updated premium amount"
  }'
```

**Expected:** HTTP 200, deduction updated.

### 5.4 Calculate Deductions
```bash
curl -X GET "http://localhost:3000/hris/employees/1/deductions/calculate/2024-06-15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** HTTP 200, returns total deductions for that date.

---

## 📊 Phase 6: History Tracking Testing

### 6.1 View Compensation History
```bash
curl -X GET http://localhost:3000/hris/employees/1/compensation/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected:** HTTP 200, returns array of all compensation changes with timestamps.

---

## 🚫 Phase 7: Validation & Error Testing

### 7.1 Test Overlapping Dates (Should Fail)
```bash
# Try to create overlapping compensation
curl -X POST http://localhost:3000/hris/employees/1/compensation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 60000,
    "effectiveDate": "2024-06-01",
    "endDate": "2024-12-31",
    "currency": "USD",
    "paymentFrequency": "monthly"
  }'
```

**Expected:** HTTP 400, "Compensation dates overlap with existing records"

### 7.2 Test Missing Effective Date (Should Fail)
```bash
curl -X POST http://localhost:3000/hris/employees/1/compensation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 50000,
    "currency": "USD",
    "paymentFrequency": "monthly"
  }'
```

**Expected:** HTTP 400, "Effective date is required for compensation creation"

### 7.3 Test Unauthorized Access (Should Fail)
```bash
curl -X GET http://localhost:3000/hris/employees/1/compensation
# No Authorization header
```

**Expected:** HTTP 401 or 403, unauthorized access.

### 7.4 Test Invalid Overtime Rate (Should Fail)
```bash
curl -X POST http://localhost:3000/hris/employees/1/compensation \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "baseSalary": 50000,
    "overtimeRate": -1.5,
    "effectiveDate": "2024-01-01",
    "currency": "USD",
    "paymentFrequency": "monthly"
  }'
```

**Expected:** HTTP 400, validation error for overtime rate.

---

## 🔄 Phase 8: Integration Testing

### 8.1 Full Employee Compensation Lifecycle
1. Create initial compensation
2. Add multiple salary changes over time
3. Add deductions
4. Calculate total compensation for different dates
5. Verify history tracking captures all changes
6. Test payroll calculation readiness

### 8.2 Performance Testing
```bash
# Test with multiple employees
for i in {1..10}; do
  curl -X POST http://localhost:3000/hris/employees/$i/compensation \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"baseSalary": 50000, "effectiveDate": "2024-01-01", "currency": "USD", "paymentFrequency": "monthly"}'
done
```

**Expected:** All requests succeed without performance degradation.

---

## 🐛 Common Issues & Troubleshooting

### Issue: "Module not found" errors
**Solution:** Ensure all entities are exported in `src/entities/index.ts`

### Issue: Authentication failures
**Solution:** Verify JWT token is valid and user has required permissions

### Issue: Database connection errors
**Solution:** Check database is running and connection string is correct

### Issue: Migration errors
**Solution:** Ensure previous migrations ran successfully, check database schema

### Issue: Permission denied errors
**Solution:** Ensure user has `hris.compensation.view` and/or `hris.compensation.manage` permissions

---

## 📋 Testing Checklist

- [ ] Application builds without errors
- [ ] Database migrations run successfully
- [ ] Authentication works correctly
- [ ] Compensation CRUD operations work
- [ ] Deductions CRUD operations work
- [ ] Calculation endpoints return correct values
- [ ] History tracking captures all changes
- [ ] Date validation prevents overlaps
- [ ] Permission-based access control works
- [ ] Error handling provides meaningful messages
- [ ] Performance is acceptable under load

---

## 🎯 Success Criteria

**All tests pass when:**
1. ✅ All API endpoints respond with expected HTTP status codes
2. ✅ Data validation works correctly (dates, amounts, enums)
3. ✅ Database relationships are maintained properly
4. ✅ Audit trail captures all compensation changes
5. ✅ Security permissions are enforced
6. ✅ Error messages are clear and actionable
7. ✅ Performance meets requirements for production use

**Ready for Phase C (Frontend Integration) when all tests pass!** 🚀
