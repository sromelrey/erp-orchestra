# 🛡️ RBAC Implementation Testing Walkthrough

This document provides a step-by-step guide to verify the complete RBAC (Role-Based Access Control) system, covering **Management UI**, **Batch Operations**, and the **Enforcement Layer**.

---

## 🏗️ Pre-test Setup
1.  Ensure both `api.orchestra.com` and `portal.orchestra.com` are running.
2.  Login as a **Tenant Admin** (User with full permissions).

---

## 🎯 Test 1: Role & Permission Management
**Goal**: Verify that custom roles can be created and granular permissions assigned via the Accordion UI.

1.  Navigate to **Settings > Roles**.
2.  Click **"Add Role"**.
3.  Create a role named `Test Manager` with a description.
4.  In the Roles table, click the **"Permissions"** button (Settings icon) for the new role.
5.  **Verify**: The Permission Picker opens as collapsible **Accordions** grouped by module (e.g., HRIS, System).
6.  **Action**: Expand the HRIS module. Select only `View Employee` using its **checkbox**.
7.  **Verify**: The accordion header updates to show "1 of X selected".
8.  **Action**: Click **"Save Permissions"** and ensure the success toast appears.
9.  **Verify**: Re-open the permissions modal — the HRIS accordion should auto-expand with `View Employee` pre-checked.
10. **Verify**: The Roles table's "Permissions" badge now shows the updated count (e.g., "1 permissions").

---

## 🎯 Test 2: Batch User Assignment from Roles Page
**Goal**: Verify that multiple users can be assigned to a role in a single batch operation.

1.  On the **Settings > Roles** page, click the **"Users"** button (Users icon) on the `Test Manager` role.
2.  **Verify**: A dialog opens showing all users with a **search bar**.
3.  **Verify**: The header badge shows "0 assigned" (since the role is new).
4.  **Action**: Use the search bar to filter by name or email.
5.  **Action**: Select 2+ users using checkboxes, or click **"Select All"**.
6.  **Verify**: The header dynamically updates to show "X selected to assign".
7.  **Action**: Click **"Assign X User(s)"** and confirm the success toast.
8.  **Verify**: Reopen the Users dialog — previously assigned users now show a ✅ green checkmark and **"Assigned"** badge, and their checkboxes are disabled.

---

## 🎯 Test 3: User-Role Assignment from Users Page
**Goal**: Verify that individual users can be linked to roles from the Users page (complementary to Test 2).

1.  Navigate to **Settings > Users**.
2.  Find a test user and click **"Roles"** (UserCog icon).
3.  **Action**: Assign the `Test Manager` role created in Test 1.
4.  **Verify**: Click "Save Changes" and ensure the list updates.

---

## 🎯 Test 4: UI Gating (The "Shield")
**Goal**: Verify that buttons hide automatically when permissions are missing.

1.  **Preparation**: Note the permissions of your test user (from Test 2/3, they only have `view` for employees).
2.  **Action**: Logout and login as that **Test User**.
3.  Navigate to **Settings > Roles**.
4.  **Verify**: The **"Add Role"** button should be **HIDDEN**.
5.  **Verify**: In the table, the **"Permissions"** and **"Users"** action buttons should be **HIDDEN**.
6.  **Logic**: The page uses `EntityManager` with `system.role.manage` gates, so these buttons should not render.

---

## 🎯 Test 5: Route Protection (The "Guard")
**Goal**: Verify that unauthorized users are blocked from entire pages and page refreshes don't cause false redirects.

1.  While logged in as the **Test User** (who lacks admin/management rights):
2.  **Action**: Manually type `http://localhost:3000/users` or `/roles` in the browser bar.
3.  **Verify**: You should be redirected to `/unauthorized`.
4.  **Verify**: The "Access Denied" page shows a brand-aligned UI with "Go Back" and "Return Home" buttons.
5.  **Action**: Login as the **Tenant Admin** again, navigate to `/roles`, then **hard-refresh** the browser (Ctrl+Shift+R).
6.  **Verify**: You should **NOT** be redirected to `/unauthorized`. The page should load normally after a brief moment.

---

## 🎯 Test 6: "Double-Gating" Foundation
**Goal**: Technical verification of the code structure.

1.  Open `portal.orchestra.com/components/auth/HasPermission.tsx`.
2.  **Verify**: The component includes props for both `permission` AND `feature`.
3.  **Verify**: The component checks `isInitialized` before evaluating permissions (prevents race condition on refresh).
4.  **Verify**: The logic is ready to handle Tenant Plan restrictions as soon as the backend feature-flagging is live.

---

## 🚩 Troubleshooting
- **Cache Issues**: If a permission change doesn't reflect immediately, check the RTK Query tags in `rolesApi.ts`. Both `{ type: 'Role', id: roleId }` and `{ type: 'Role', id: 'LIST' }` must be invalidated.
- **Unauthorized on Refresh**: Ensure `HasPermission.tsx` checks `selectIsInitialized` before evaluating. If the flag is `false`, it should return `null` instead of redirecting.
- **Database**: Check the `role_permissions` and `user_roles` junction tables to confirm raw data persistence.
