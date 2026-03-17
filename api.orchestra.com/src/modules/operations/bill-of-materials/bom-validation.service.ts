import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BomRepository } from './repositories/bom.repository';
import { BomItemRepository } from './repositories/bom-item.repository';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface BomWithItems {
  id: number;
  parentMaterialId: number;
  items: Array<{
    componentMaterialId: number;
  }>;
}

@Injectable()
export class BomValidationService {
  constructor(
    private readonly bomRepository: BomRepository,
    private readonly bomItemRepository: BomItemRepository,
  ) {}

  async detectCyclesByComponents(
    tenantId: number,
    parentMaterialId: number,
    componentIds: number[],
  ): Promise<void> {
    for (const componentId of componentIds) {
      const visited = new Set<number>();
      const recursionStack = new Set<number>();

      if (
        await this.hasCycle(
          tenantId,
          componentId,
          parentMaterialId,
          visited,
          recursionStack,
        )
      ) {
        throw new BadRequestException(
          `Circular dependency detected: Material ${componentId} is used in the BOM of material ${parentMaterialId}`,
        );
      }
    }
  }

  private async hasCycle(
    tenantId: number,
    currentId: number,
    targetParentId: number,
    visited: Set<number>,
    recursionStack: Set<number>,
  ): Promise<boolean> {
    if (recursionStack.has(currentId)) return true;
    if (visited.has(currentId)) return false;
    if (currentId === targetParentId) return true;

    visited.add(currentId);
    recursionStack.add(currentId);

    // Get BOMs where current material is used as parent within the same tenant
    const childBoms = await this.bomRepository.find(tenantId, {
      where: { parentMaterialId: currentId },
      relations: ['items'],
    });

    for (const bom of childBoms as BomWithItems[]) {
      for (const item of bom.items) {
        if (
          await this.hasCycle(
            tenantId,
            item.componentMaterialId,
            targetParentId,
            visited,
            recursionStack,
          )
        ) {
          return true;
        }
      }
    }

    recursionStack.delete(currentId);
    return false;
  }

  async validateVersionUniqueness(
    tenantId: number,
    parentMaterialId: number,
    version: string,
    excludeId?: number,
  ): Promise<void> {
    // Use the repository directly
    const queryBuilder = this.bomRepository
      .getRepository()
      .createQueryBuilder('bom')
      .where('bom.tenantId = :tenantId', { tenantId })
      .andWhere('bom.parentMaterialId = :parentMaterialId', {
        parentMaterialId,
      })
      .andWhere('bom.version = :version', { version })
      .andWhere('bom.isActive = :isActive', { isActive: true });

    if (excludeId) {
      queryBuilder.andWhere('bom.id != :excludeId', { excludeId });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException(
        `Version ${version} already exists for material ID ${parentMaterialId}`,
      );
    }
  }

  async validateComponentsExist(/* componentIds: number[] */): Promise<void> {
    // This would validate against the items/materials table
    // For now, we'll assume the materials exist if they're referenced
    // In a real implementation, you'd check the materials table
  }

  async validateBomLines(
    bomId: number,
    // tenantId: number,
  ): Promise<ValidationResult> {
    const lines = await this.bomItemRepository.find({
      where: { bomId },
    });

    const errors: string[] = [];

    if (lines.length === 0) {
      errors.push('BOM must have at least one component');
    }

    // Check for duplicate components
    const componentIds = lines.map((l) => l.componentMaterialId);
    const uniqueIds = new Set(componentIds);
    if (componentIds.length !== uniqueIds.size) {
      errors.push('BOM contains duplicate components');
    }

    // Validate quantities
    for (const line of lines) {
      if (line.quantity <= 0) {
        errors.push(
          `Component ${line.componentMaterialId} has invalid quantity`,
        );
      }
      if (line.scrapPercentage < 0 || line.scrapPercentage > 100) {
        errors.push(
          `Component ${line.componentMaterialId} has invalid scrap percentage`,
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  async canDeactivate(tenantId: number, bomId: number): Promise<void> {
    const bom = await this.bomRepository.findOne(tenantId, {
      where: { id: bomId, isActive: true },
    });

    if (!bom) {
      throw new NotFoundException('BOM not found or already inactive');
    }

    // Check if there are active production orders or other references
    // For now, we'll allow deactivation
  }
}
