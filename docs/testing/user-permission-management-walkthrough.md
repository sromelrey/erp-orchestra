# User Permission Management - Walkthrough Testing Guide

## Overview
This walkthrough testing guide covers the complete user permission management implementation, including both backend API endpoints and frontend UI components.

## Prerequisites
- Backend API running on `http://localhost:3000`
- Frontend application running on `http://localhost:3001` (or configured port)
- Admin user credentials: `admin@orchestra.com` / `admin123`
- Test permissions available in the system

---

## 🧪 Backend API Testing

### 1. Authentication Setup
First, authenticate as admin to get access token:

```http
### Admin Login
# @name adminLogin
POST {{API_BASE_URL}}/v1/auth/login
Content-Type: application/json

{
    "email": "admin@orchestra.com",
    "password": "admin123"
}

### Set auth token for subsequent requests
@accessToken = {{adminLogin.response.body.accessToken}}
```

### 2. Get Available Permissions
Verify permissions exist in the system:

```http
### Get All Permissions
# @name getPermissions
GET {{API_BASE_URL}}/v1/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

### Store a permission ID for testing
@permissionId = {{getPermissions.response.body.data[0].id}}
```

### 3. Get Test User
Find an existing user or create one for testing:

```http
### Get All Users
# @name getUsers
GET {{API_BASE_URL}}/v1/users
Authorization: Bearer {{accessToken}}
Content-Type: application/json

### Store a user ID for testing
@userId = {{getUsers.response.body.data[0].id}}
```

### 4. Test User Permission Assignment

#### 4.1 Assign GRANT Permissions
```http
### Assign User Permissions (GRANT)
# @name assignGrantPermissions
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "GRANT",
    "expiresAt": "2025-12-31T23:59:59Z"
}

### Expected Response: 200 OK
### Should return updated user object
```

#### 4.2 Assign DENY Permissions
```http
### Assign User Permissions (DENY Override)
# @name assignDenyPermissions
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "DENY"
}

### Expected Response: 200 OK
### Should return updated user object
```

#### 4.3 Assign Multiple Permissions
```http
### Assign Multiple User Permissions
# @name assignMultiplePermissions
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}, 2, 3],
    "type": "GRANT",
    "expiresAt": "2025-12-31T23:59:59Z"
}

### Expected Response: 200 OK
### Should return updated user object
```

### 5. Test User Permission Retrieval

#### 5.1 Get User Permissions
```http
### Get User Permissions
# @name getUserPermissions
GET {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

### Expected Response: 200 OK
### Should return array of UserPermission objects with full details
### Response should include:
### - id, userId, permissionId, type, expiresAt, grantedAt
### - permission object with slug, module, action, etc.
```

#### 5.2 Get Effective Permissions
```http
### Get Effective Permissions (Combined Role + User GRANT - User DENY)
# @name getEffectivePermissions
GET {{API_BASE_URL}}/v1/users/{{userId}}/permissions/effective
Authorization: Bearer {{accessToken}}
Content-Type: application/json

### Expected Response: 200 OK
### Should return array of permission slugs (strings)
### Represents final computed permission set
```

### 6. Test User Permission Removal

#### 6.1 Remove Specific Permissions
```http
### Remove Specific User Permissions
# @name removeSpecificPermissions
DELETE {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}]
}

### Expected Response: 200 OK
### Should return updated user object
```

#### 6.2 Clear All User Permissions
```http
### Clear All User Permissions
# @name clearAllPermissions
DELETE {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": []
}

### Expected Response: 200 OK
### Should return updated user object with no user permissions
```

### 7. Test Error Scenarios

#### 7.1 Invalid User ID
```http
### Test Invalid User ID
# @name invalidUserId
POST {{API_BASE_URL}}/v1/users/99999/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "GRANT"
}

### Expected Response: 404 Not Found
```

#### 7.2 Invalid Permission IDs
```http
### Test Invalid Permission IDs
# @name invalidPermissionIds
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [99999, 99998],
    "type": "GRANT"
}

### Expected Response: 404 Not Found or 400 Bad Request
```

#### 7.3 Invalid Permission Type
```http
### Test Invalid Permission Type
# @name invalidPermissionType
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "INVALID"
}

### Expected Response: 400 Bad Request
```

#### 7.4 Past Expiration Date
```http
### Test Past Expiration Date
# @name pastExpirationDate
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Authorization: Bearer {{accessToken}}
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "GRANT",
    "expiresAt": "2020-01-01T00:00:00Z"
}

### Expected Response: 400 Bad Request
```

#### 7.5 Unauthorized Access
```http
### Test Unauthorized Access
# @name unauthorizedAccess
POST {{API_BASE_URL}}/v1/users/{{userId}}/permissions
Content-Type: application/json

{
    "permissionIds": [{{permissionId}}],
    "type": "GRANT"
}

### Expected Response: 401 Unauthorized
```

---

## 🎨 Frontend UI Testing

### 1. Navigate to Users Page
1. Open browser to `http://localhost:3001/system/users`
2. Login with admin credentials if not already authenticated
3. Verify users list loads successfully

### 2. Test Permission Management UI

#### 2.1 Open Permission Manager
1. Find any user in the users table
2. Click the **"Permissions"** button in the "Manage" column
3. Verify permission management dialog opens

#### 2.2 Verify UI Components
Check that the following components are present and functional:
- ✅ **Permission Type Selector** (GRANT/DENY dropdown)
- ✅ **Expiration Date Picker** (date input)
- ✅ **Search Bar** (for filtering permissions)
- ✅ **Clear All Button**
- ✅ **Permission Matrix** (grouped by modules)
- ✅ **Current Permissions Summary**
- ✅ **Save/Cancel Buttons**

#### 2.3 Test Permission Matrix Interaction
1. **Module Selection**: Click checkbox in module header to select all permissions in that module
2. **Individual Selection**: Click individual permission cards to toggle selection
3. **Visual Feedback**: Verify selected permissions are highlighted (green for GRANT, red for DENY)
4. **Search Functionality**: Type in search bar to filter permissions
5. **Permission Type Toggle**: Switch between GRANT and DENY types

#### 2.4 Test Permission Assignment
1. Select several permissions using the matrix
2. Set permission type to "GRANT"
3. Set an expiration date (optional)
4. Click **"Grant Permissions"** button
5. Verify success message appears
6. Close dialog and reopen to verify permissions are saved

#### 2.5 Test Permission Removal
1. Open permission manager for the same user
2. Switch to permission type that has assigned permissions
3. Deselect some permissions by clicking them
4. Click **"Grant Permissions"** (or "Deny Permissions") button
5. Verify success message and permissions are removed

#### 2.6 Test Bulk Operations
1. Use **"Clear All"** button to reset selection
2. Select entire module using module checkbox
3. Assign multiple permissions at once
4. Verify bulk assignment works correctly

### 3. Test Responsive Design
1. Resize browser window to different sizes
2. Verify permission matrix adapts to screen size
3. Test on mobile view if possible
4. Verify all controls remain accessible

### 4. Test Error Handling

#### 4.1 Network Errors
1. Use browser dev tools to simulate offline mode
2. Try to save permissions
3. Verify appropriate error message appears

#### 4.2 Validation Errors
1. Try to save without selecting any permissions
2. Verify validation prevents empty submission
3. Try to set past expiration date
4. Verify appropriate error handling

---

## 🔧 Integration Testing

### 1. End-to-End Workflow
Test the complete user permission workflow:

1. **Create Test User** (if needed)
2. **Assign Role Permissions** via role management
3. **Assign User Permissions** via new permission manager
4. **Verify Effective Permissions** via API
5. **Test Permission Override** (DENY overriding GRANT)
6. **Test Permission Expiration** (if implemented)
7. **Clean Up** permissions and user

### 2. Performance Testing
1. **Bulk Assignment**: Test assigning 50+ permissions at once
2. **Search Performance**: Test search with large permission sets
3. **UI Responsiveness**: Verify UI remains responsive during operations

### 3. Cross-Browser Testing
Test in multiple browsers:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (if available)
- ✅ Edge (if available)

---

## 📋 Testing Checklist

### Backend API Tests
- [ ] Authentication works correctly
- [ ] GET /users/{id}/permissions returns user permissions
- [ ] GET /users/{id}/permissions/effective returns effective permissions
- [ ] POST /users/{id}/permissions assigns permissions (GRANT)
- [ ] POST /users/{id}/permissions assigns permissions (DENY)
- [ ] DELETE /users/{id}/permissions removes permissions
- [ ] Bulk operations work correctly
- [ ] Expiration dates are handled properly
- [ ] Error scenarios return appropriate responses
- [ ] Authorization/permission checks work

### Frontend UI Tests
- [ ] Permission manager dialog opens correctly
- [ ] All UI components render properly
- [ ] Permission matrix displays correctly
- [ ] Search and filtering work
- [ ] Permission selection works (individual and bulk)
- [ ] Permission type switching works
- [ ] Expiration date picker works
- [ ] Save/cancel operations work
- [ ] Success/error messages display
- [ ] Responsive design works
- [ ] Integration with users page works

### Integration Tests
- [ ] Frontend-backend integration works
- [ ] Real-time updates after permission changes
- [ ] Cache invalidation works correctly
- [ ] Permission inheritance calculation works
- [ ] Performance meets requirements (<200ms for bulk ops)

---

## 🐛 Common Issues & Troubleshooting

### Backend Issues
1. **404 Errors**: Check if UserService methods are implemented
2. **Permission Denied**: Verify user has `system.user.manage` permission
3. **Validation Errors**: Check DTO validation rules
4. **Database Errors**: Verify database connection and migrations

### Frontend Issues
1. **Component Not Loading**: Check import paths and component registration
2. **API Errors**: Verify API base URL and authentication
3. **State Issues**: Check Redux store and RTK Query cache
4. **UI Not Updating**: Verify cache invalidation tags

### Performance Issues
1. **Slow API Response**: Check database queries and indexing
2. **UI Lag**: Optimize React renders and state updates
3. **Memory Leaks**: Check component cleanup and subscriptions

---

## ✅ Success Criteria

The implementation is considered successful when:

1. **All API endpoints** work correctly with proper error handling
2. **Frontend UI** provides intuitive permission management
3. **Bulk operations** meet performance requirements (<200ms)
4. **Permission calculations** are accurate and consistent
5. **User experience** is smooth and error-free
6. **Documentation** is complete and accurate
7. **Security** is maintained throughout the system

---

## 📝 Notes for Testers

- Use the provided `.http` file for automated API testing
- Test with different user roles and permission levels
- Pay special attention to edge cases and error scenarios
- Document any issues found with reproduction steps
- Verify that the implementation matches the original requirements
- Test both happy path and error scenarios thoroughly

**Happy Testing! 🚀**
