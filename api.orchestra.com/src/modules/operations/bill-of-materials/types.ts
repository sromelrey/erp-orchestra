import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    nextCursor: string | number | null;
  };
}

export interface ListBomQuery extends CursorPaginationDto {
  search?: string;
  parentMaterialId?: number;
  status?: string;
  isActive?: boolean;
}

export interface BomCostResult {
  bomId: number;
  totalCost: number;
  componentCosts: {
    componentMaterialId: number;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }[];
}
