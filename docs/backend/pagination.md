# Pagination Standards

To ensure high performance and scalability, the Orchestra ERP backend utilizes **Cursor-Based Pagination** for all list endpoints. Offset-based pagination (`SKIP` and `LIMIT`) is discouraged for large datasets due to performance degradation at high offsets.

## 1. DTO Structure

All list endpoints that support pagination should accept the `CursorPaginationDto`.

```typescript
// src/common/dto/cursor-pagination.dto.ts
export class CursorPaginationDto {
  @ApiPropertyOptional({
    description: 'Cursor for pagination (ID of the last item)',
    example: 10,
  })
  @IsOptional()
  cursor?: string | number;

  @ApiPropertyOptional({
    description: 'Number of items to return',
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;
}
```

## 2. Service Implementation Pattern

The standard implementation uses TypeORM's `QueryBuilder`. We fetch `limit + 1` items to determine if there is a next page.

```typescript
/**
 * Example implementation in a Service
 */
async findAll(
  tenantId: number,
  paginationDto: CursorPaginationDto,
): Promise<PaginatedResult<Entity>> {
  const { cursor, limit = 10 } = paginationDto;
  const queryBuilder = this.repository.createQueryBuilder('e');

  queryBuilder.where('e.tenantId = :tenantId', { tenantId });

  if (cursor) {
    queryBuilder.andWhere('e.id > :cursor', { cursor });
  }

  // Order by ID is required for consistent cursor behavior
  queryBuilder.orderBy('e.id', 'ASC').take(limit + 1);

  const items = await queryBuilder.getMany();
  let nextCursor: string | number | null = null;

  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem ? nextItem.id : null;
  }

  return {
    data: items,
    meta: {
      nextCursor,
    },
  };
}
```

## 3. Controller Implementation

Ensure the `@Query()` decorator is used and Swagger documentation reflects the paginated result.

```typescript
@Get()
@RequirePermissions('resource.view')
@ApiOperation({ summary: 'List resources with pagination' })
@ApiResponse({ status: 200, description: 'Paginated list of resources.' })
async findAll(
  @Query() paginationDto: CursorPaginationDto,
  @Req() req: AuthenticatedRequest,
): Promise<PaginatedResult<Entity>> {
  return this.service.findAll(req.user.tenantId, paginationDto);
}
```

## 4. Response Format

All paginated responses must follow this structure:

```json
{
  "data": [...],
  "meta": {
    "nextCursor": 123
  }
}
```
