# BOM APIs Implementation Plan

| Field | Value |
|-------|-------|
| **Story ID** | STORY-OPS-003-B |
| **Name** | Bill of Materials APIs Implementation |
| **Type** | Backend |
| **Status** | ✅ Implemented |
| **Priority** | High |
| **Dependencies** | EPIC-01 (RBAC), BOM Entities (completed) | 

---

## 🎯 Purpose
Build comprehensive CRUD APIs for Bill of Materials with versioning support, cycle detection validation, and UoM enforcement on top of existing BOM entities.

---

## 📋 Implementation Tasks

### 1. Module Generation & Structure
**Command**: `nest g resource modules/operations/bill-of-materials`

**Expected Structure**:
```
src/modules/operations/bill-of-materials/
├── bill-of-materials.controller.ts
├── bill-of-materials.service.ts
├── bill-of-materials.module.ts
├── dto/
│   ├── create-bom-header.dto.ts
│   ├── update-bom-header.dto.ts
│   ├── create-bom-line.dto.ts
│   ├── update-bom-line.dto.ts
│   └── bom-version.dto.ts
├── bill-of-materials.endpoints.http
└── bom-validation.service.ts
```

### 2. DTOs Implementation

#### CreateBomHeaderDto
```typescript
export class CreateBomHeaderDto {
  @IsString()
  @Length(1, 100)
  code: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsInt()
  @Min(1)
  finishedGoodItemId: number;

  @IsString()
  @Length(1, 20)
  version: string;

  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBomLineDto)
  lines: CreateBomLineDto[];
}
```

#### CreateBomLineDto
```typescript
export class CreateBomLineDto {
  @IsInt()
  @Min(1)
  componentItemId: number;

  @IsInt()
  @Min(1)
  uomId: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0.000001)
  quantity: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @Max(0.9999)
  scrapFactor?: number;
}
```

### 3. Service Implementation

#### Core Methods
```typescript
@Injectable()
export class BillOfMaterialsService {
  // Create BOM with validation
  async create(createBomDto: CreateBomHeaderDto): Promise<BomHeader>

  // Update BOM (creates new version)
  async update(id: number, updateBomDto: UpdateBomHeaderDto): Promise<BomHeader>

  // Get BOM by ID with lines
  async findOne(id: number): Promise<BomHeader>

  // List BOMs with filters
  async findAll(query: ListBomDto): Promise<PaginatedResult<BomHeader>>

  // Deactivate BOM
  async deactivate(id: number): Promise<void>

  // Get active BOM for item
  async getActiveForItem(itemId: number): Promise<BomHeader>

  // Calculate BOM cost
  async calculateCost(bomId: number): Promise<BomCostResult>
}
```

### 4. Validation Service

#### BomValidationService
```typescript
@Injectable()
export class BomValidationService {
  // Detect circular dependencies
  async detectCycles(itemId: number, componentIds: number[]): Promise<boolean>

  // Validate UoM conversions
  async validateUomConversions(lines: CreateBomLineDto[]): Promise<ValidationResult>

  // Check if item can be component (not already a parent)
  async validateComponentHierarchy(itemId: number, parentId: number): Promise<boolean>

  // Validate BOM version uniqueness
  async validateVersionUniqueness(itemId: number, version: string): Promise<boolean>
}
```

#### Cycle Detection Algorithm
```typescript
private async hasCycle(
  itemId: number,
  visited: Set<number>,
  recursionStack: Set<number>
): Promise<boolean> {
  if (recursionStack.has(itemId)) return true;
  if (visited.has(itemId)) return false;

  visited.add(itemId);
  recursionStack.add(itemId);

  // Get all BOMs where this item is a component
  const parentBoms = await this.getBomsWhereItemIsComponent(itemId);
  
  for (const bom of parentBoms) {
    if (await this.hasCycle(bom.finishedGoodItemId, visited, recursionStack)) {
      return true;
    }
  }

  recursionStack.delete(itemId);
  return false;
}
```

### 5. Controller Implementation

#### Endpoints
```typescript
@Controller('bom')
@UseGuards(JwtAuthGuard, TenantGuard)
export class BillOfMaterialsController {
  @Post()
  @Permission('operations.bom.manage')
  async create(@Body() createBomDto: CreateBomHeaderDto)

  @Get()
  @Permission('operations.bom.view')
  async findAll(@Query() query: ListBomDto)

  @Get(':id')
  @Permission('operations.bom.view')
  async findOne(@Param('id') id: string)

  @Patch(':id')
  @Permission('operations.bom.manage')
  async update(
    @Param('id') id: string,
    @Body() updateBomDto: UpdateBomHeaderDto
  )

  @Delete(':id')
  @Permission('operations.bom.manage')
  async remove(@Param('id') id: string)

  @Post(':id/deactivate')
  @Permission('operations.bom.manage')
  async deactivate(@Param('id') id: string)

  @Get('item/:itemId/active')
  @Permission('operations.bom.view')
  async getActiveForItem(@Param('itemId') itemId: string)

  @Get(':id/cost')
  @Permission('operations.bom.view')
  async calculateCost(@Param('id') id: string)

  @Get(':id/where-used')
  @Permission('operations.bom.view')
  async getWhereUsed(@Param('id') id: string)
}
```

### 6. Versioning Logic

#### Version Management
```typescript
private async createNewVersion(
  bomHeader: BomHeader,
  updateDto: UpdateBomHeaderDto
): Promise<BomHeader> {
  // Deactivate old version
  await this.bomHeaderRepository.update(bomHeader.id, {
    isActive: false,
    updatedAt: new Date()
  });

  // Create new version
  const newVersion = this.bomHeaderRepository.create({
    ...bomHeader,
    ...updateDto,
    version: this.generateNextVersion(bomHeader.finishedGoodItemId),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return await this.bomHeaderRepository.save(newVersion);
}

private async generateNextVersion(itemId: number): Promise<string> {
  const latestVersion = await this.bomHeaderRepository
    .createQueryBuilder('bom')
    .where('bom.finishedGoodItemId = :itemId', { itemId })
    .orderBy('bom.createdAt', 'DESC')
    .getOne();

  if (!latestVersion) return '1.0';

  // Parse version and increment
  const [major, minor] = latestVersion.version.split('.').map(Number);
  return `${major}.${minor + 1}`;
}
```

### 7. Error Handling

#### Custom Exceptions
```typescript
export class BomCycleException extends BadRequestException {
  constructor(itemId: number) {
    super(`Circular dependency detected for item ID: ${itemId}`);
  }
}

export class BomUomConversionException extends BadRequestException {
  constructor(itemUom: string, componentUom: string) {
    super(`No conversion found from ${componentUom} to ${itemUom}`);
  }
}

export class BomVersionExistsException extends ConflictException {
  constructor(itemId: number, version: string) {
    super(`Version ${version} already exists for item ID: ${itemId}`);
  }
}
```

### 8. Database Transactions

#### Transaction Usage
```typescript
async create(createBomDto: CreateBomHeaderDto): Promise<BomHeader> {
  return await this.dataSource.transaction(async manager => {
    // Validate first
    await this.bomValidationService.detectCycles(
      createBomDto.finishedGoodItemId,
      createBomDto.lines.map(l => l.componentItemId)
    );

    // Create header
    const bomHeader = manager.create(BomHeader, {
      ...createBomDto,
      isActive: true
    });
    const savedHeader = await manager.save(bomHeader);

    // Create lines
    for (const line of createBomDto.lines) {
      const bomLine = manager.create(BomLine, {
        ...line,
        bomHeaderId: savedHeader.id,
        isActive: true
      });
      await manager.save(bomLine);
    }

    return savedHeader;
  });
}
```

### 9. Testing Endpoints

#### bill-of-materials.endpoints.http
```http
### Create BOM
POST {{baseUrl}}/v1/ops/bom
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "code": "BOM-TSHIRT-001",
  "name": "T-Shirt Assembly",
  "finishedGoodItemId": 1,
  "version": "1.0",
  "effectiveDate": "2026-03-16",
  "lines": [
    {
      "componentItemId": 2,
      "uomId": 1,
      "quantity": 1.5,
      "scrapFactor": 0.05
    },
    {
      "componentItemId": 3,
      "uomId": 2,
      "quantity": 3
    }
  ]
}

### Get BOM by ID
GET {{baseUrl}}/v1/ops/bom/1
Authorization: Bearer {{token}}

### Update BOM (creates new version)
PATCH {{baseUrl}}/v1/ops/bom/1
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "T-Shirt Assembly v2",
  "lines": [
    {
      "componentItemId": 2,
      "uomId": 1,
      "quantity": 1.6,
      "scrapFactor": 0.03
    }
  ]
}

### Get active BOM for item
GET {{baseUrl}}/v1/ops/bom/item/1/active
Authorization: Bearer {{token}}

### Calculate BOM cost
GET {{baseUrl}}/v1/ops/bom/1/cost
Authorization: Bearer {{token}}

### Get where used (implosion)
GET {{baseUrl}}/v1/ops/bom/2/where-used
Authorization: Bearer {{token}}
```

---

## 🔒 Security & RBAC

### Required Permissions (already seeded):
- `operations.bom.view` - View BOMs and calculations
- `operations.bom.manage` - Create, update, deactivate BOMs

### Guards to Apply:
- `JwtAuthGuard` - Authentication
- `TenantGuard` - Tenant isolation
- `PermissionGuard` - Permission-based access

---

## 📊 Performance Considerations

1. **Indexing**:
   - Composite index on `(finished_good_item_id, version, is_active)`
   - Index on `component_item_id` in bom_lines for where-used queries

2. **Caching**:
   - Cache active BOM for items
   - Cache BOM cost calculations

3. **Query Optimization**:
   - Use joins for BOM with lines
   - Batch operations for multiple lines

---

## ✅ Definition of Done

1. ✅ All CRUD endpoints implemented and tested
2. ✅ Cycle detection validation working
3. ✅ UoM conversion validation enforced
4. ✅ Versioning creates new versions on update
5. ✅ RBAC permissions applied
6. ✅ Error handling covers all edge cases
7. ✅ HTTP endpoints file created for testing
8. ✅ OpenAPI documentation complete with examples

---

## 🚀 Next Steps After Implementation

1. Integration with procurement for PO receipt consumption
2. BOM explosion for production orders
3. Material requirements planning (MRP) calculations
4. Cost roll-up with actual costs from procurement
