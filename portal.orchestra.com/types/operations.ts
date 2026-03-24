// Warehouse Types
export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseRequest {
  code: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateWarehouseRequest {
  id: string;
  body: Partial<CreateWarehouseRequest>;
}

export interface WarehousesQueryParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Location Types
export interface Location {
  id: string;
  code: string;
  name: string;
  warehouseId: string;
  parentId?: string | null;
  path: string;
  depth: number;
  type?: LocationType;
  capacity?: number;
  currentStock?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocationTreeNode extends Location {
  children: LocationTreeNode[];
}

export interface CreateLocationRequest {
  code: string;
  name: string;
  warehouseId: string;
  parentId?: number;
  type?: LocationType;
  capacity?: number;
  isActive?: boolean;
}

export interface UpdateLocationRequest {
  id: string;
  warehouseId: string;
  body: Partial<CreateLocationRequest>;
}

export interface LocationsQueryParams {
  warehouseId: string;
  search?: string;
  parentId?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export enum LocationType {
  STORAGE = 'storage',
  PICKING = 'picking',
  RECEIVING = 'receiving',
  SHIPPING = 'shipping',
  STAGING = 'staging',
  QUARANTINE = 'quarantine',
}

// Capacity Types
export interface CapacityInfo {
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  locationBreakdown: {
    locationId: string;
    locationName: string;
    usedCapacity: number;
    totalCapacity: number;
  }[];
}

// Stock Ledger Types
export interface StockLedgerEntry {
  id: string;
  warehouseId: string;
  locationId?: string;
  itemId: string;
  uomId: string;
  quantity: number;
  movementType: StockMovementType;
  referenceType?: string;
  referenceCode?: string;
  memo?: string;
  documentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockMovementRequest {
  warehouseId: string;
  locationId?: string;
  itemId: string;
  uomId: string;
  quantity: number;
  movementType: StockMovementType;
  referenceType?: string;
  referenceCode?: string;
  memo?: string;
  documentDate?: string;
}

export interface StockLedgerQueryParams {
  warehouseId?: string;
  locationId?: string;
  itemId?: string;
  movementType?: StockMovementType;
  referenceType?: string;
  referenceCode?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export enum StockMovementType {
  RECEIPT = 'RECEIPT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT',
  PICK = 'PICK',
  PACK = 'PACK',
  SHIP = 'SHIP',
  RETURN = 'RETURN',
  DAMAGE = 'DAMAGE',
  EXPIRE = 'EXPIRE',
}
