# Frontend User Permission Management - Manual Testing Guide

## 🎯 Testing Overview
This guide provides step-by-step instructions for manually testing the frontend user permission management UI.

## 🧪 Test Environment Setup

### Prerequisites
1. Backend API running on `http://localhost:3000`
2. Frontend application running on `http://localhost:3001`
3. Admin user credentials: `admin@orchestra.com` / `admin123`
4. Modern web browser (Chrome, Firefox, Safari, Edge)

### Test Data Preparation
1. Ensure you have test users in the system
2. Ensure you have test permissions available
3. Log in as admin user to access user management

---

## 📱 Frontend UI Testing Steps

### Step 1: Navigate to Users Page
1. Open browser and go to `http://localhost:3001`
2. Login with admin credentials
3. Navigate to **System → Users** in the sidebar
4. Verify users list loads successfully
5. Check that each user row shows "Roles" and "Permissions" buttons

### Step 2: Open Permission Manager Dialog
1. Find any user in the users table
2. Click the **"Permissions"** button in the "Manage" column
3. **Expected Result**: Permission management dialog opens with title "Manage User Permissions"

### Step 3: Verify UI Components Present
Check that all required components are visible and functional:

#### ✅ Header Section
- [ ] User name displayed in header
- [ ] Selected permissions count badge
- [ ] Close button (X) in top-right

#### ✅ Controls Section
- [ ] Search bar with search icon
- [ ] Permission type selector (GRANT/DENY dropdown)
- [ ] Expiration date picker (date input)
- [ ] "Clear All" button

#### ✅ Permission Matrix
- [ ] Permissions grouped by modules (system, hris, etc.)
- [ ] Each module shows permission count badge
- [ ] Module-level checkbox for select all
- [ ] Individual permission cards with:
  - [ ] Checkbox for selection
  - [ ] Permission icon based on action type
  - [ ] Permission slug/name
  - [ ] Module and action info
  - [ ] Action type badge

#### ✅ Current Permissions Summary
- [ ] Section showing current assigned permissions
- [ ] Permission type indicator (GRANT/DENY)
- [ ] Expiration date badges (if applicable)
- [ ] Module badges for each permission

#### ✅ Action Buttons
- [ ] "Cancel" button
- [ ] Dynamic action button ("Grant Permissions" or "Deny Permissions")

### Step 4: Test Permission Type Switching
1. Click the permission type dropdown
2. Select **"DENY"** from the dropdown
3. **Expected Result**: 
   - Button text changes to "Deny Permissions"
   - Button color changes to red theme
   - Selected permissions reset for new type
4. Switch back to **"GRANT"**
5. **Expected Result**: Button returns to green theme

### Step 5: Test Search Functionality
1. Type a permission name or action in the search bar
2. **Expected Result**: Permission matrix filters to show only matching permissions
3. Clear the search bar
4. **Expected Result**: All permissions return to view

### Step 6: Test Permission Selection

#### Individual Selection
1. Click on any permission card
2. **Expected Result**: 
   - Checkbox toggles on/off
   - Card highlights (green for GRANT, red for DENY)
   - Selected count updates
3. Click the same permission again
4. **Expected Result**: Selection is removed

#### Module Selection
1. Click the module-level checkbox
2. **Expected Result**: All permissions in that module are selected
3. Click the module checkbox again
4. **Expected Result**: All permissions in that module are deselected

#### Mixed Selection
1. Select some permissions manually
2. Click module checkbox
3. **Expected Result**: All permissions in module are selected
4. Click module checkbox again
5. **Expected Result**: All permissions in module are deselected

### Step 7: Test Expiration Date
1. Click the expiration date input
2. Select a future date
3. **Expected Result**: Date is populated in the input
4. Clear the date input
5. **Expected Result**: Expiration is removed (no expiration)

### Step 8: Test Permission Assignment

#### Grant Permissions
1. Select 2-3 permissions
2. Ensure type is set to "GRANT"
3. Set an expiration date (optional)
4. Click **"Grant Permissions"** button
5. **Expected Result**:
   - Loading state shows on button
   - Success toast message appears
   - Dialog closes
   - Permissions are saved

#### Verify Assignment
1. Reopen permission manager for the same user
2. Switch to "GRANT" type
3. **Expected Result**: Previously assigned permissions are pre-selected
4. Check "Current Permissions Summary"
5. **Expected Result**: Shows assigned permissions with expiration dates

#### Deny Permissions
1. Switch to "DENY" type
2. Select 1-2 permissions
3. Click **"Deny Permissions"** button
4. **Expected Result**:
   - Success toast message appears
   - Dialog closes
   - DENY permissions are saved

### Step 9: Test Permission Removal

#### Remove Specific Permissions
1. Open permission manager
2. Switch to the type with assigned permissions
3. Deselect some permissions by clicking them
4. Click the action button
5. **Expected Result**: Deselected permissions are removed

#### Clear All Permissions
1. Click **"Clear All"** button
2. Click the action button
3. **Expected Result**: All permissions of that type are removed

### Step 10: Test Cancel Operation
1. Make some selections
2. Click **"Cancel"** button
3. **Expected Result**: 
   - Dialog closes
   - No changes are saved
   - Reopening dialog shows original state

### Step 11: Test Error Handling

#### Empty Selection
1. Don't select any permissions
2. Click the action button
3. **Expected Result**: Validation prevents submission or shows appropriate message

#### Network Error Simulation
1. Open browser dev tools
2. Go to Network tab
3. Set to "Offline" mode
4. Try to save permissions
5. **Expected Result**: Appropriate error message appears

### Step 12: Test Responsive Design
1. Resize browser window to tablet size (~768px)
2. **Expected Result**: Layout adapts properly
3. Resize to mobile size (~375px)
4. **Expected Result**: 
   - Permission matrix adjusts (single column)
   - Controls stack vertically
   - Dialog remains usable

### Step 13: Test Performance
1. Select all permissions in a large module
2. Observe UI responsiveness
3. **Expected Result**: No lag or freezing
4. Perform bulk operations
5. **Expected Result**: Operations complete quickly (<2 seconds)

---

## 🔍 Integration Testing

### Test 1: Backend Integration
1. Use browser dev tools to monitor network requests
2. Perform permission operations
3. **Expected Result**: Correct API calls are made with proper data

### Test 2: Real-time Updates
1. Open permission manager in two browser tabs
2. Make changes in one tab
3. **Expected Result**: Other tab reflects changes when reopened

### Test 3: Cache Invalidation
1. Assign permissions to a user
2. Navigate away and back to users page
3. **Expected Result**: User data is updated correctly

---

## 📊 Cross-Browser Testing

### Chrome (Primary)
- [ ] All functionality works as expected
- [ ] Performance is acceptable
- [ ] No console errors

### Firefox
- [ ] All functionality works
- [ ] Styling is consistent
- [ ] No compatibility issues

### Safari (if available)
- [ ] All functionality works
- [ ] Touch interactions work
- [ ] Performance is acceptable

### Edge (if available)
- [ ] All functionality works
- [ ] No rendering issues
- [ ] Performance is acceptable

---

## ✅ Success Criteria

### Functional Requirements
- [ ] User can open permission manager dialog
- [ ] User can switch between GRANT/DENY types
- [ ] User can search and filter permissions
- [ ] User can select/deselect permissions individually
- [ ] User can select/deselect entire modules
- [ ] User can set expiration dates
- [ ] User can save permission changes
- [ ] User can cancel changes
- [ ] System shows appropriate success/error messages

### Performance Requirements
- [ ] Dialog opens quickly (<500ms)
- [ ] Permission selection is responsive (<100ms)
- [ ] Save operations complete quickly (<2 seconds)
- [ ] Search filtering is instant (<200ms)

### Usability Requirements
- [ ] Interface is intuitive and easy to use
- [ ] Visual feedback is clear and helpful
- [ ] Error messages are informative
- [ ] Responsive design works on all screen sizes

### Technical Requirements
- [ ] No console errors or warnings
- [ ] Proper error handling for network issues
- [ ] Clean state management
- [ ] Memory usage is reasonable

---

## 🐛 Common Issues to Check

### UI Issues
- Permission cards not highlighting correctly
- Checkboxes not syncing with selection state
- Search not filtering properly
- Dialog not closing on save/cancel

### State Issues
- Selection state not persisting between type switches
- Previous permissions not loading correctly
- Cache not invalidating properly

### Performance Issues
- Lag when selecting many permissions
- Slow search filtering
- Memory leaks on repeated operations

### Integration Issues
- API calls failing with incorrect data
- Authentication issues
- Permission validation errors

---

## 📝 Testing Notes

### During Testing
1. Take screenshots of any issues found
2. Note browser version and OS
3. Record exact steps to reproduce issues
4. Check browser console for errors
5. Monitor network requests for API issues

### After Testing
1. Document all findings
2. Categorize issues by severity
3. Provide reproduction steps for bugs
4. Suggest improvements for UX

**Happy Testing! 🎯**
