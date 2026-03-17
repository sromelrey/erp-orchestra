import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

export class BomCycleException extends BadRequestException {
  constructor(itemId: number) {
    super(`Circular dependency detected for material ID: ${itemId}`);
  }
}

export class BomUomConversionException extends BadRequestException {
  constructor(itemUom: string, componentUom: string) {
    super(`No conversion found from ${componentUom} to ${itemUom}`);
  }
}

export class BomVersionExistsException extends ConflictException {
  constructor(itemId: number, version: string) {
    super(`Version ${version} already exists for material ID: ${itemId}`);
  }
}

export class BomNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`BOM with ID ${id} not found`);
  }
}

export class BomInactiveException extends BadRequestException {
  constructor(id: number) {
    super(`BOM with ID ${id} is not active`);
  }
}
