# Backend Development Rules & Skills for Windsurf

This document defines comprehensive rules and skills for Windsurf AI agents when working on backend development in the ERP Orchestra project using NestJS and TypeORM.

---

## 🎯 Core Development Rules

### **1. Architecture & Structure Rules**

#### **Rule 1.1: Module Generation Standards**
- **MUST** use NestJS CLI for module generation: `nest g resource modules/[entity-name]`
- **MUST** select REST API transport layer
- **MUST** enable CRUD entry points for standard entities
- **SKILL**: Module Generation - Automatically generates complete module structure

#### **Rule 1.2: File Organization**
- **MUST** follow standard NestJS module structure
- **MUST** separate concerns: Controller → Service → Repository
- **MUST** use absolute imports (`@/entities/product.entity`)
- **FORBIDDEN** nested relative imports (`../../../`)
- **SKILL**: Structural Analysis - Maintains clean, organized code structure

#### **Rule 1.3: Naming Conventions**
- **MUST** use PascalCase for classes and entities
- **MUST** use camelCase for methods and properties
- **MUST** use kebab-case for file names and routes
- **MUST** use descriptive, meaningful names
- **SKILL**: Naming Optimization - Ensures consistent, clear naming throughout

### **2. Code Quality Rules**

#### **Rule 2.1: TypeScript Implementation**
- **MUST** define proper interfaces for all DTOs
- **MUST** use strict TypeScript configuration
- **MUST** leverage TypeORM for strong typing
- **FORBIDDEN** `any` types in production code
- **SKILL**: Type Safety - Ensures comprehensive type coverage

#### **Rule 2.2: NestJS Best Practices**
- **MUST** use dependency injection properly
- **MUST** implement proper error handling
- **MUST** use decorators appropriately
- **MUST** follow NestJS module patterns
- **SKILL**: NestJS Optimization - Identifies and applies NestJS best practices

#### **Rule 2.3: Database Integration**
- **MUST** use TypeORM entities with proper decorators
- **MUST** define relationships correctly
- **MUST** use proper database types and constraints
- **MUST** handle database migrations properly
- **SKILL**: Database Design - Optimizes database schema and relationships

### **3. API Development Rules**

#### **Rule 3.1: REST API Standards**
- **MUST** follow RESTful principles
- **MUST** use proper HTTP methods and status codes
- **MUST** implement consistent response formats
- **MUST** use meaningful endpoint names
- **SKILL**: API Design - Creates clean, intuitive REST APIs

#### **Rule 3.2: Security Implementation**
- **MUST** implement proper authentication guards
- **MUST** use permission-based authorization
- **MUST** validate all input data
- **MUST** implement proper error handling
- **SKILL**: Security Assessment - Identifies and fixes security vulnerabilities

#### **Rule 3.3: Documentation Standards**
- **MUST** use Swagger decorators for all endpoints
- **MUST** document all DTOs with @ApiProperty
- **MUST** include meaningful examples
- **MUST** document error responses
- **SKILL**: Documentation Generation - Creates comprehensive API documentation

---

## 🛠️ Specialized Skills

### **1. Controller Development Skills**

#### **Skill 1.1: Controller Template Generation**
```typescript
// Automatically generates complete controller with all decorators
@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @RequirePermissions('products.create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.', type: Product })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateProductDto })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

#### **Skill 1.2: Permission Integration**
```typescript
// Automatically adds proper permission decorators
@RequirePermissions('resource.action')
@ApiOperation({ summary: 'Operation description' })
@ApiResponse({ status: 200, description: 'Success', type: EntityType })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 403, description: 'Forbidden' })
```

#### **Skill 1.3: Error Handling Implementation**
```typescript
// Implements comprehensive error handling
try {
  return await this.service.create(dto);
} catch (error) {
  if (error instanceof BadRequestException) {
    throw new BadRequestException('Invalid data provided');
  }
  throw new InternalServerErrorException('Operation failed');
}
```

### **2. Service Layer Skills**

#### **Skill 2.1: Service Template Creation**
```typescript
// Creates comprehensive service with proper documentation
@Injectable()
export class ProductsService {
  /**
   * Creates a new product record.
   * 
   * @param createProductDto - The product data
   * @returns The created Product entity
   * @throws {BadRequestException} If invalid data provided
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Implementation with proper error handling
  }
}
```

#### **Skill 2.2: Business Logic Implementation**
```typescript
// Implements complex business logic with proper validation
async createCompensation(employeeId: number, data: CreateCompensationDto): Promise<EmployeeCompensation> {
  // Validate business rules
  await this.validateCompensationRules(employeeId, data);
  
  // Create entity with transaction
  return await this.entityManager.transaction(async (manager) => {
    const compensation = manager.create(EmployeeCompensation, {
      employeeId,
      ...data,
      tenantId: this.getCurrentTenantId(),
    });
    
    // Log history
    await this.logCompensationChange(manager, compensation, 'CREATE');
    
    return manager.save(compensation);
  });
}
```

#### **Skill 2.3: Transaction Management**
```typescript
// Implements proper transaction handling
async updateWithTransaction(id: number, data: UpdateDto): Promise<Entity> {
  return await this.entityManager.transaction(async (manager) => {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    
    // Update and log changes
    const updated = await manager.save(Entity, { ...entity, ...data });
    await this.logChange(manager, entity, updated);
    
    return updated;
  });
}
```

### **3. Entity & Database Skills**

#### **Skill 3.1: Entity Definition**
```typescript
// Creates complete TypeORM entities with proper decorators
@Entity('employee_compensations')
export class EmployeeCompensation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  @Index()
  employeeId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseSalary?: number;

  @Column({ name: 'payment_frequency' })
  @Enum(PaymentFrequency)
  paymentFrequency: PaymentFrequency;

  @Column({ name: 'effective_date' })
  @Index()
  effectiveDate: Date;

  @Column({ name: 'end_date', nullable: true })
  endDate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

#### **Skill 3.2: Relationship Management**
```typescript
// Defines proper relationships between entities
@ManyToOne(() => Employee, (employee) => employee.compensations)
@JoinColumn({ name: 'employee_id' })
employee: Employee;

@OneToMany(() => CompensationHistory, (history) => history.compensation)
history: CompensationHistory[];
```

#### **Skill 3.3: Repository Pattern Implementation**
```typescript
// Creates custom repository methods when needed
@EntityRepository(EmployeeCompensation)
export class EmployeeCompensationRepository extends Repository<EmployeeCompensation> {
  async findActiveByEmployee(employeeId: number): Promise<EmployeeCompensation[]> {
    return this.find({
      where: { employeeId, isActive: true },
      order: { effectiveDate: 'DESC' },
    });
  }

  async findEffectiveAtDate(employeeId: number, date: Date): Promise<EmployeeCompensation | null> {
    return this.findOne({
      where: {
        employeeId,
        isActive: true,
        effectiveDate: LessThanOrEqual(date),
        OR: [
          { endDate: IsNull() },
          { endDate: MoreThanOrEqual(date) },
        ],
      },
    });
  }
}
```

### **4. DTO & Validation Skills**

#### **Skill 4.1: DTO Generation**
```typescript
// Creates comprehensive DTOs with proper validation
export class CreateCompensationDto {
  @ApiProperty({ example: 50000, description: 'Base salary amount' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  baseSalary?: number;

  @ApiProperty({ example: 250, description: 'Hourly rate' })
  @IsNumber()
  @IsOptional()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ example: '2024-01-01', description: 'Effective date' })
  @IsDateString()
  @IsNotEmpty()
  effectiveDate: string;

  @ApiProperty({ example: 'monthly', description: 'Payment frequency' })
  @IsEnum(PaymentFrequency)
  @IsOptional()
  paymentFrequency?: PaymentFrequency;
}
```

#### **Skill 4.2: Custom Validation**
```typescript
// Implements custom validation decorators
@Injectable()
export class CompensationValidationService {
  async validateCompensationRules(employeeId: number, data: CreateCompensationDto): Promise<void> {
    // Check for overlapping compensation periods
    const existing = await this.repository.findEffectiveAtDate(employeeId, new Date(data.effectiveDate));
    if (existing) {
      throw new BadRequestException('Compensation already exists for this period');
    }
    
    // Validate business rules
    if (data.baseSalary && data.baseSalary < this.minimumWage) {
      throw new BadRequestException('Base salary cannot be below minimum wage');
    }
  }
}
```

### **5. Testing Skills**

#### **Skill 5.1: Endpoint Testing**
```typescript
// Creates comprehensive endpoint tests
describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should create product', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Test Product',
      price: 29.99,
    };

    const result = await controller.create(createProductDto);
    expect(result).toEqual(expect.objectContaining(createProductDto));
  });
});
```

#### **Skill 5.2: Service Testing**
```typescript
// Implements comprehensive service tests
describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should create product with validation', async () => {
    const createDto = { name: 'Test', price: 10 };
    const expected = { id: 1, ...createDto };
    
    jest.spyOn(repository, 'save').mockResolvedValue(expected as Product);
    
    const result = await service.create(createDto);
    expect(result).toEqual(expected);
  });
});
```

### **6. Documentation Skills**

#### **Skill 6.1: API Documentation**
```typescript
// Automatically generates comprehensive API documentation
@ApiOperation({ 
  summary: 'Create employee compensation',
  description: 'Creates a new compensation record for an employee with proper validation and history tracking'
})
@ApiResponse({ 
  status: 201, 
  description: 'Compensation created successfully',
  schema: {
    example: {
      id: 1,
      employeeId: 123,
      baseSalary: 50000,
      effectiveDate: '2024-01-01',
      isActive: true,
    }
  }
})
@ApiResponse({ 
  status: 400, 
  description: 'Invalid input data or business rule violation' 
})
@ApiResponse({ 
  status: 401, 
  description: 'Authentication required' 
})
@ApiResponse({ 
  status: 403, 
  description: 'Insufficient permissions' 
})
```

#### **Skill 6.2: Code Documentation**
```typescript
// Creates comprehensive code documentation
/**
 * Manages employee compensation operations including CRUD, validation, and history tracking.
 * 
 * This service handles:
 * - Creating and updating compensation records
 * - Validating business rules and constraints
 * - Maintaining audit history for all changes
 * - Calculating compensation based on various factors
 * 
 * @example
 * ```typescript
 * const compensation = await service.createCompensation(123, {
 *   baseSalary: 50000,
 *   effectiveDate: '2024-01-01'
 * });
 * ```
 */
@Injectable()
export class CompensationService {
  // Implementation
}
```

### **7. Performance Optimization Skills**

#### **Skill 7.1: Database Optimization**
- **Query Optimization**: Identifies slow queries and suggests improvements
- **Index Management**: Recommends proper database indexes
- **Connection Pooling**: Optimizes database connection usage

#### **Skill 7.2: Caching Strategies**
```typescript
// Implements proper caching strategies
@Cacheable(`compensation:${args[0]}`, 300) // 5 minutes cache
async getEmployeeCompensation(employeeId: number): Promise<EmployeeCompensation[]> {
  return this.repository.find({ where: { employeeId, isActive: true } });
}

@CacheInvalidate(`compensation:${args[0]}`)
async updateCompensation(employeeId: number, data: UpdateCompensationDto): Promise<EmployeeCompensation> {
  // Implementation
}
```

#### **Skill 7.3: Memory Management**
- **Resource Cleanup**: Ensures proper cleanup of resources
- **Memory Leaks**: Identifies and fixes memory leaks
- **Optimization**: Suggests memory usage improvements

---

## 🔍 Quality Assurance Skills

### **1. Code Review Skills**
- **Pattern Consistency**: Ensures code follows established patterns
- **Security Review**: Identifies security vulnerabilities
- **Performance Analysis**: Assesses performance implications
- **Maintainability**: Evaluates code maintainability

### **2. Testing Skills**
- **Test Coverage**: Ensures comprehensive test coverage
- **Test Quality**: Validates test effectiveness
- **Integration Testing**: Ensures proper component integration
- **Load Testing**: Assesses performance under load

### **3. Security Skills**
- **Vulnerability Assessment**: Identifies security issues
- **Authentication**: Validates authentication implementation
- **Authorization**: Ensures proper permission checks
- **Data Validation**: Validates input sanitization

---

## 🚀 Automation Skills

### **1. Code Generation**
- **Module Generation**: Automatically generates complete modules
- **Entity Creation**: Creates entities with proper decorators
- **API Generation**: Generates complete API endpoints
- **Test Generation**: Creates comprehensive test suites

### **2. Refactoring Skills**
- **Code Cleanup**: Removes unused code and imports
- **Pattern Application**: Applies consistent patterns
- **Optimization**: Identifies and implements improvements
- **Standardization**: Ensures code follows standards

### **3. Integration Skills**
- **Module Integration**: Seamlessly integrates new modules
- **Database Integration**: Handles database changes properly
- **API Integration**: Ensures proper API integration
- **Testing Integration**: Integrates testing properly

---

## 📋 Development Workflow Skills

### **1. Feature Implementation**
1. **Requirements Analysis**: Understand feature requirements
2. **Design Planning**: Plan architecture and implementation
3. **Module Generation**: Generate necessary modules
4. **Implementation**: Write code following standards
5. **Testing**: Implement comprehensive tests
6. **Documentation**: Create proper documentation

### **2. Bug Resolution**
1. **Issue Identification**: Locate and understand the issue
2. **Root Cause Analysis**: Find the underlying cause
3. **Solution Implementation**: Implement proper fix
4. **Testing**: Validate the fix works
5. **Documentation**: Document the change

### **3. Enhancement Development**
1. **Opportunity Identification**: Find improvement opportunities
2. **Impact Analysis**: Assess benefits and risks
3. **Implementation**: Apply improvements
4. **Validation**: Ensure improvements work
5. **Documentation**: Document enhancements

---

## 🎯 Success Metrics

### **Code Quality Indicators**
- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ 100% test coverage for critical paths
- ✅ Proper error handling
- ✅ Comprehensive documentation

### **Performance Indicators**
- ✅ Fast API response times
- ✅ Efficient database queries
- ✅ Proper memory usage
- ✅ Optimized resource utilization
- ✅ Scalable architecture

### **Security Indicators**
- ✅ Proper authentication
- ✅ Comprehensive authorization
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ Secure data handling

---

## 🔄 Continuous Improvement

### **Learning & Adaptation**
- **Pattern Recognition**: Learns from existing code patterns
- **Best Practices**: Stays current with industry standards
- **Technology Updates**: Adapts to new technologies
- **Feedback Integration**: Incorporates user feedback

### **Quality Evolution**
- **Standards Compliance**: Maintains and improves standards
- **Performance Optimization**: Continuously optimizes performance
- **Security Enhancement**: Improves security measures
- **Documentation Maintenance**: Keeps documentation current

This comprehensive set of rules and skills ensures Windsurf agents can consistently produce high-quality, secure, and maintainable backend code that aligns perfectly with the ERP Orchestra project's NestJS and TypeORM standards.
