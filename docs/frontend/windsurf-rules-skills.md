# Frontend Development Rules & Skills for Windsurf

This document defines comprehensive rules and skills for Windsurf AI agents when working on frontend development in the ERP Orchestra project.

---

## 🎯 Core Development Rules

### **1. Architecture & Structure Rules**

#### **Rule 1.1: EntityManager Pattern Enforcement**
- **MUST** use EntityManager pattern for all CRUD operations
- **MUST** create separate files: `page.tsx`, `column.tsx`, `form-fields.tsx`
- **FORBIDDEN** inline column/form definitions in page components
- **SKILL**: Pattern Recognition - Identify existing EntityManager implementations and replicate structure

#### **Rule 1.2: Component Organization**
- **MUST** follow folder structure: `app/(main)/[entity-name]/`
- **MUST** separate UI logic from business logic
- **MUST** use composition over inheritance
- **SKILL**: Structural Analysis - Analyze existing component patterns and apply consistently

#### **Rule 1.3: Import Organization**
- **MUST** group imports: React → External → Internal → Types
- **MUST** use absolute paths (`@/components/ui/button`)
- **FORBIDDEN** nested relative imports (`../../../`)
- **SKILL**: Import Optimization - Organize imports automatically and suggest better paths

### **2. Code Quality Rules**

#### **Rule 2.1: TypeScript Safety**
- **MUST** define proper interfaces for all data structures
- **FORBIDDEN** `any` types except in specific migration scenarios
- **MUST** use proper typing for RTK Query hooks
- **SKILL**: Type Inference - Automatically generate types from API responses

#### **Rule 2.2: React Best Practices**
- **MUST** use functional components with hooks
- **MUST** handle loading and error states properly
- **MUST** use proper dependency arrays in useEffect
- **SKILL**: React Optimization - Identify performance issues and suggest improvements

#### **Rule 2.3: State Management**
- **MUST** use RTK Query for all API calls
- **MUST** use proper cache invalidation with tags
- **FORBIDDEN** direct fetch/axios calls
- **SKILL**: Cache Strategy - Optimize RTK Query caching and invalidation

### **3. UI/UX Rules**

#### **Rule 3.1: Component Library Usage**
- **MUST** use existing UI components from `@/components/ui/`
- **MUST** follow established design system
- **FORBIDDEN** custom styling when system components exist
- **SKILL**: Component Selection - Choose appropriate components from design system

#### **Rule 3.2: Responsive Design**
- **MUST** ensure mobile compatibility
- **MUST** use proper breakpoints and responsive utilities
- **MUST** test on multiple screen sizes
- **SKILL**: Responsive Analysis - Automatically check and suggest responsive improvements

#### **Rule 3.3: Accessibility**
- **MUST** include proper ARIA labels
- **MUST** ensure keyboard navigation
- **MUST** use semantic HTML elements
- **SKILL**: Accessibility Audit - Identify and fix accessibility issues

---

## 🛠️ Specialized Skills

### **1. EntityManager Integration Skills**

#### **Skill 1.1: Column Definition**
```typescript
// Automatically generates proper column definitions
export const columns: Column<EmployeeCompensation>[] = [
  {
    header: "Base Salary",
    accessorKey: "baseSalary",
    cell: (item) => (
      <span className="font-medium">
        {item.baseSalary ? `₱${item.baseSalary.toLocaleString()}` : "N/A"}
      </span>
    ),
  },
];
```

#### **Skill 1.2: Form Field Configuration**
```typescript
// Creates comprehensive form field configurations
export const formFields: FormField[] = [
  {
    name: "baseSalary",
    label: "Base Salary",
    type: "number",
    placeholder: "Enter base salary in pesos",
    required: false,
  },
];
```

#### **Skill 1.3: Page Composition**
```typescript
// Composes EntityManager with proper handlers
const handleCreate = async (formData: Record<string, unknown>) => {
  try {
    const compensationData: CreateCompensationDto = {
      baseSalary: formData.baseSalary as number | undefined,
      // ... proper type casting
    };
    await createCompensation({ employeeId: selectedEmployeeId, body: compensationData }).unwrap();
    toast.success("Compensation record created successfully");
    refetch();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create compensation record";
    toast.error(errorMessage);
  }
};
```

### **2. RTK Query Integration Skills**

#### **Skill 2.1: API Definition**
```typescript
// Creates comprehensive API definitions with proper typing
export const compensationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeCompensation: builder.query<EmployeeCompensation[], number>({
      query: (employeeId) => `/hris/employees/${employeeId}/compensation`,
      providesTags: (result, error, employeeId) => [{ type: 'Compensation', id: employeeId }],
    }),
  }),
});
```

#### **Skill 2.2: Cache Management**
```typescript
// Implements proper cache invalidation strategies
invalidatesTags: (result, error, { employeeId }) => [
  { type: 'Compensation', id: employeeId },
  { type: 'CompensationHistory', id: employeeId },
],
```

### **3. Permission & Security Skills**

#### **Skill 3.1: Permission Guard Integration**
```typescript
// Automatically adds proper permission guards
<PermissionGuard permission="hris.compensation.view">
  <div className="space-y-4">
    {/* Component content */}
  </div>
</PermissionGuard>
```

#### **Skill 3.2: Sidebar Configuration**
```typescript
// Adds menu items with proper permission gating
{
  label: "Compensation",
  href: "/hris/compensation",
  icon: DollarSign,
  description: "Manage employee compensation records",
  permission: "hris.compensation.view",
}
```

### **4. Error Handling Skills**

#### **Skill 4.1: Comprehensive Error Management**
```typescript
// Implements robust error handling with user feedback
const handleCreate = async (formData: Record<string, unknown>) => {
  try {
    // API call
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create record";
    toast.error(errorMessage);
  }
};
```

### **5. Performance Optimization Skills**

#### **Skill 5.1: Component Optimization**
- Identifies unnecessary re-renders
- Suggests React.memo usage
- Optimizes useEffect dependencies

#### **Skill 5.2: Bundle Optimization**
- Analyzes import sizes
- Suggests code splitting opportunities
- Identifies unused dependencies

---

## 🎨 UI/UX Enhancement Skills

### **1. Design System Adherence**
- **Skill**: Consistently applies design tokens and spacing
- **Pattern Recognition**: Identifies and applies existing UI patterns
- **Component Reuse**: Maximizes use of existing components

### **2. User Experience Optimization**
- **Skill**: Loading State Management - Implements proper loading indicators
- **Skill**: Empty State Design - Creates meaningful empty states
- **Skill**: Error State Handling - Provides clear error feedback

### **3. Responsive Design Implementation**
- **Skill**: Mobile-First Approach - Ensures mobile compatibility
- **Skill**: Breakpoint Management - Uses proper responsive breakpoints
- **Skill**: Touch Interaction - Optimizes for touch devices

---

## 🔍 Quality Assurance Skills

### **1. Code Review Skills**
- **Pattern Consistency**: Ensures code follows established patterns
- **Type Safety**: Validates TypeScript usage
- **Performance Impact**: Assesses performance implications

### **2. Testing Skills**
- **Test Generation**: Creates comprehensive test cases
- **Coverage Analysis**: Identifies untested code paths
- **Integration Testing**: Ensures component integration works

### **3. Documentation Skills**
- **Code Documentation**: Adds meaningful comments and JSDoc
- **Component Documentation**: Documents component props and usage
- **API Documentation**: Maintains API documentation consistency

---

## 🚀 Automation Skills

### **1. Code Generation**
- **Boilerplate Creation**: Generates standard component templates
- **API Integration**: Automatically creates RTK Query hooks
- **Type Generation**: Creates TypeScript interfaces from API schemas

### **2. Refactoring Skills**
- **Code Cleanup**: Removes unused imports and code
- **Pattern Application**: Applies consistent patterns across codebase
- **Optimization**: Identifies and implements performance improvements

### **3. Integration Skills**
- **Module Integration**: Seamlessly integrates new features
- **Dependency Management**: Handles package dependencies properly
- **Build Optimization**: Ensures builds are optimized

---

## 📋 Development Workflow Skills

### **1. Feature Implementation**
1. **Analysis**: Understand requirements and existing patterns
2. **Planning**: Break down into manageable tasks
3. **Implementation**: Write code following standards
4. **Integration**: Ensure proper integration with existing code
5. **Testing**: Verify functionality works correctly

### **2. Bug Resolution**
1. **Identification**: Locate root cause of issues
2. **Analysis**: Understand impact and dependencies
3. **Resolution**: Implement fixes following patterns
4. **Validation**: Ensure fixes work and don't break other features

### **3. Enhancement Development**
1. **Opportunity Identification**: Find areas for improvement
2. **Impact Assessment**: Evaluate benefits and costs
3. **Implementation**: Apply enhancements systematically
4. **Validation**: Ensure improvements are beneficial

---

## 🎯 Success Metrics

### **Code Quality Indicators**
- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ 100% pattern consistency
- ✅ Proper error handling
- ✅ Comprehensive testing

### **User Experience Indicators**
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ Fast loading times
- ✅ Intuitive navigation
- ✅ Clear error messages

### **Maintainability Indicators**
- ✅ Clean code structure
- ✅ Comprehensive documentation
- ✅ Consistent patterns
- ✅ Proper separation of concerns
- ✅ Easy to understand and modify

---

## 🔄 Continuous Improvement

### **Learning & Adaptation**
- **Pattern Recognition**: Continuously learns from existing code patterns
- **Feedback Integration**: Incorporates user feedback and suggestions
- **Technology Updates**: Stays current with best practices and technologies

### **Quality Evolution**
- **Standards Compliance**: Maintains and improves code standards
- **Performance Optimization**: Continuously optimizes for better performance
- **User Experience**: Enhances UX based on usage patterns and feedback

This comprehensive set of rules and skills ensures Windsorf agents can consistently produce high-quality, maintainable, and user-friendly frontend code that aligns perfectly with the ERP Orchestra project standards.
