# Permission Implementation Guide

## Overview

This guide explains how to implement Role-Based Access Control (RBAC) for new features in the backend. Every new feature must follow the "Double-Gated" security pattern to ensure proper access control.

## Core Principles

### Double-Gated Security
Access is granted only if **both** conditions are met:
1. **Feature Gate**: The Tenant's active Plan includes the required system Module
2. **Permission Gate**: The User's assigned Role has the specific permission slug

### Permission Slug Convention
Permissions follow the pattern: `{resource}.{action}`

**Examples:**
- `operations.goods-receipt.create`
- `operations.goods-receipt.view`
- `operations.goods-receipt.update`
- `operations.goods-receipt.delete`
- `operations.goods-receipt.confirm`
- `operations.goods-receipt.cancel`

**Standard Actions:**
- `create` - Create new records
- `view` - Read/view records
- `update` - Edit existing records
- `delete` - Delete records
- `confirm` - Confirm/approve records (workflow-specific)
- `cancel` - Cancel records (workflow-specific)

## Step-by-Step Implementation

### Step 1: Define Feature Module (if new)

If the feature belongs to a new module, add it to the `SystemModule` enum:

```typescript
// src/common/enums/system-module.enum.ts
export enum SystemModule {
  HRIS = 'HRIS',
  OPS = 'OPS',
  INVENTORY = 'INVENTORY',
  PAYROLL = 'PAYROLL',
  // Add new module here
  YOUR_NEW_MODULE = 'YOUR_NEW_MODULE',
}
```

### Step 2: Seed Permissions in Database

Add the required permissions to the permission seeds:

```typescript
// src/database/seeds/permissions.seed.ts
const permissions = [
  // ... existing permissions
  
  // Your new feature permissions
  {
    slug: 'operations.goods-receipt.create',
    name: 'Create Goods Receipt',
    description: 'Allows creating new goods receipts',
  },
  {
    slug: 'operations.goods-receipt.view',
    name: 'View Goods Receipt',
    description: 'Allows viewing goods receipts',
  },
  {
    slug: 'operations.goods-receipt.update',
    name: 'Update Goods Receipt',
    description: 'Allows editing goods receipts',
  },
  {
    slug: 'operations.goods-receipt.delete',
    name: 'Delete Goods Receipt',
    description: 'Allows deleting goods receipts',
  },
  {
    slug: 'operations.goods-receipt.confirm',
    name: 'Confirm Goods Receipt',
    description: 'Allows confirming goods receipts',
  },
  {
    slug: 'operations.goods-receipt.cancel',
    name: 'Cancel Goods Receipt',
    description: 'Allows cancelling goods receipts',
  },
];
```

### Step 3: Add Guards to Controller

Apply the `@RequireAccess` decorator to controller endpoints:

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthenticatedGuard, CombinedAccessGuard } from '@/common/guards';
import { RequireAccess } from '@/common/decorators/require-access.decorator';

@Controller('ops/goods-receipt')
@UseGuards(AuthenticatedGuard, CombinedAccessGuard)
export class GoodsReceiptController {
  
  @Get()
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.view',
  })
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.goodsReceiptService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.view',
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.findOne(id, req.user.tenantId);
  }

  @Post()
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.create',
  })
  async create(
    @Body() dto: CreateGoodsReceiptDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.create(dto, req.user.tenantId);
  }

  @Patch(':id')
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.update',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateGoodsReceiptDto,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.update(id, dto, req.user.tenantId);
  }

  @Delete(':id')
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.delete',
  })
  async delete(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.delete(id, req.user.tenantId);
  }

  @Post(':id/confirm')
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.confirm',
  })
  async confirm(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.confirm(id, req.user.tenantId);
  }

  @Post(':id/cancel')
  @RequireAccess({
    feature: SystemModule.OPS,
    permission: 'operations.goods-receipt.cancel',
  })
  async cancel(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest
  ) {
    return this.goodsReceiptService.cancel(id, req.user.tenantId);
  }
}
```

### Step 4: Enforce Tenant Isolation in Service

Always filter by `tenantId` in service methods to prevent data leakage:

```typescript
@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private goodsReceiptRepository: Repository<GoodsReceipt>,
  ) {}

  async findAll(tenantId: number): Promise<GoodsReceipt[]> {
    // ✅ CORRECT: Always filter by tenantId
    return this.goodsReceiptRepository.find({
      where: { tenantId },
      relations: ['items', 'warehouse', 'location'],
    });
  }

  async findOne(id: string, tenantId: number): Promise<GoodsReceipt> {
    // ✅ CORRECT: Filter by both id and tenantId
    return this.goodsReceiptRepository.findOne({
      where: { id: parseInt(id), tenantId },
      relations: ['items', 'warehouse', 'location'],
    });
  }

  async create(dto: CreateGoodsReceiptDto, tenantId: number): Promise<GoodsReceipt> {
    // ✅ CORRECT: Associate with tenantId
    const goodsReceipt = this.goodsReceiptRepository.create({
      ...dto,
      tenantId,
    });
    return this.goodsReceiptRepository.save(goodsReceipt);
  }

  async update(id: string, dto: UpdateGoodsReceiptDto, tenantId: number): Promise<GoodsReceipt> {
    // ✅ CORRECT: Verify ownership before updating
    const goodsReceipt = await this.findOne(id, tenantId);
    if (!goodsReceipt) {
      throw new NotFoundException('Goods receipt not found');
    }
    return this.goodsReceiptRepository.save({ ...goodsReceipt, ...dto });
  }

  async delete(id: string, tenantId: number): Promise<void> {
    // ✅ CORRECT: Verify ownership before deleting
    const goodsReceipt = await this.findOne(id, tenantId);
    if (!goodsReceipt) {
      throw new NotFoundException('Goods receipt not found');
    }
    await this.goodsReceiptRepository.remove(goodsReceipt);
  }
}
```

### Step 5: Seed System Roles with New Permissions

Update the system role seeds to include the new permissions:

```typescript
// src/database/seeds/roles.seed.ts
const systemRoles = [
  {
    name: 'Super Admin',
    description: 'Full system access',
    tenantId: null, // System role
    permissions: [
      // ... existing permissions
      'operations.goods-receipt.create',
      'operations.goods-receipt.view',
      'operations.goods-receipt.update',
      'operations.goods-receipt.delete',
      'operations.goods-receipt.confirm',
      'operations.goods-receipt.cancel',
    ],
  },
  {
    name: 'Operations Manager',
    description: 'Operations management access',
    tenantId: null,
    permissions: [
      'operations.goods-receipt.create',
      'operations.goods-receipt.view',
      'operations.goods-receipt.update',
      'operations.goods-receipt.confirm',
      'operations.goods-receipt.cancel',
      // Note: No delete permission
    ],
  },
  {
    name: 'Operations Staff',
    description: 'Operations staff access',
    tenantId: null,
    permissions: [
      'operations.goods-receipt.view',
      'operations.goods-receipt.create',
      // Note: No update, delete, confirm, or cancel permissions
    ],
  },
];
```

## Testing Permissions

### Unit Test Example

```typescript
describe('GoodsReceiptController', () => {
  let controller: GoodsReceiptController;
  let service: GoodsReceiptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodsReceiptController],
      providers: [GoodsReceiptService],
    }).compile();

    controller = module.get<GoodsReceiptController>(GoodsReceiptController);
    service = module.get<GoodsReceiptService>(GoodsReceiptService);
  });

  it('should deny access without view permission', async () => {
    const mockUser = {
      id: 1,
      tenantId: 1,
      permissions: [], // No view permission
    };

    await expect(
      controller.findAll({ user: mockUser } as AuthenticatedRequest)
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow access with view permission', async () => {
    const mockUser = {
      id: 1,
      tenantId: 1,
      permissions: ['operations.goods-receipt.view'],
    };

    jest.spyOn(service, 'findAll').mockResolvedValue([]);
    const result = await controller.findAll({ user: mockUser } as AuthenticatedRequest);
    expect(result).toEqual([]);
  });
});
```

## Common Pitfalls

### ❌ Don't Skip Tenant Filtering
```typescript
// BAD: Allows cross-tenant data access
async findAll() {
  return this.goodsReceiptRepository.find();
}
```

### ❌ Don't Use ID Only for Ownership Check
```typescript
// BAD: Vulnerable to ID spoofing
async findOne(id: string) {
  return this.goodsReceiptRepository.findOne({ where: { id: parseInt(id) } });
}
```

### ❌ Don't Forget to Add Permissions to Roles
```typescript
// BAD: Permission exists but no role has it
const permissions = ['operations.goods-receipt.create'];
// But roles.seed.ts doesn't include this permission
```

### ✅ Always Use Both ID and TenantId
```typescript
// GOOD: Prevents ID spoofing
async findOne(id: string, tenantId: number) {
  return this.goodsReceiptRepository.findOne({
    where: { id: parseInt(id), tenantId },
  });
}
```

## Checklist for New Features

- [ ] Define/identify the SystemModule for the feature
- [ ] Add permission slugs to permissions.seed.ts
- [ ] Apply `@RequireAccess` decorator to all controller endpoints
- [ ] Enforce tenantId filtering in all service methods
- [ ] Add permissions to appropriate system roles
- [ ] Write tests for permission checks
- [ ] Update API documentation with permission requirements
- [ ] Test with different user roles to verify access control

## Related Documentation

- [RBAC Architecture](./RBAC-Architecture.md) - Overall RBAC system design
- [Module Creation Guide](./module-creation-guide.md) - How to create new modules
- [API Guidelines](./api-guidelines.md) - API development standards
