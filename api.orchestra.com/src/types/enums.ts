export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  PRINT = 'PRINT',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

export enum RoleStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MaterialType {
  RAW = 'RAW',
  SEMI_FINISHED = 'SEMI_FINISHED',
  FINISHED = 'FINISHED',
  SERVICE = 'SERVICE',
}

export enum BomStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  OBSOLETE = 'OBSOLETE',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum StockMovementType {
  RECEIPT = 'RECEIPT',
  ISSUE = 'ISSUE',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum StockAdjustmentType {
  DAMAGE = 'DAMAGE',
  LOSS = 'LOSS',
  FOUND = 'FOUND',
  COUNT = 'COUNT',
}

export enum CostingMethod {
  STANDARD = 'STANDARD',
  AVERAGE = 'AVERAGE',
  FIFO = 'FIFO',
  LIFO = 'LIFO',
  ACTUAL = 'ACTUAL',
}

export enum CostComponentType {
  MATERIAL = 'MATERIAL',
  LABOR = 'LABOR',
  OVERHEAD = 'OVERHEAD',
  SCRAP = 'SCRAP',
}
