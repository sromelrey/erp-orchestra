import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  Bom,
  BomItem,
  Material,
  BomCosting,
  BomCostingComponent,
  BomCostingHistory,
} from '@/entities';
import {
  CalculateBomCostDto,
  BomCostingResultDto,
  BomCostingComponentDto,
  UpdateBomCostingDto,
} from '../dto';
import { CostingMethod, CostComponentType } from '@/types/enums';

@Injectable()
export class BomCostingService {
  constructor(
    @InjectRepository(Bom)
    private bomRepository: Repository<Bom>,
    @InjectRepository(BomItem)
    private bomItemRepository: Repository<BomItem>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
    @InjectRepository(BomCosting)
    private bomCostingRepository: Repository<BomCosting>,
    @InjectRepository(BomCostingComponent)
    private bomCostingComponentRepository: Repository<BomCostingComponent>,
    @InjectRepository(BomCostingHistory)
    private bomCostingHistoryRepository: Repository<BomCostingHistory>,
    private dataSource: DataSource,
  ) {}

  /**
   * Calculate BOM cost with full costing logic
   */
  async calculateBomCost(
    bomId: number,
    tenantId: number,
    options: CalculateBomCostDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _userId: number,
  ): Promise<BomCostingResultDto> {
    const bom = await this.bomRepository.findOne({
      where: { id: bomId, tenantId },
      relations: ['items', 'parentMaterial'],
    });

    if (!bom) {
      throw new Error('BOM not found');
    }

    const items = (bom.items ?? []) as BomItem[];
    const components: BomCostingComponentDto[] = [];
    let totalMaterialCost = 0;
    let totalScrapCost = 0;

    // Calculate material costs
    for (const item of items) {
      const material = await this.materialRepository.findOne({
        where: { id: item.componentMaterialId, tenantId },
      });

      if (!material) {
        throw new Error(
          `Material with ID ${item.componentMaterialId} not found`,
        );
      }

      // Get material cost based on costing method
      const unitCost = await this.getMaterialCost(
        material.id,
        options.costingMethod || CostingMethod.STANDARD,
        options.costDate ? new Date(options.costDate) : new Date(),
      );

      const effectiveQuantity = options.includeScrap
        ? Number(item.quantity) * (1 + Number(item.scrapPercentage || 0) / 100)
        : Number(item.quantity);

      const itemTotalCost = effectiveQuantity * unitCost;
      const scrapCost = options.includeScrap
        ? ((Number(item.quantity) * Number(item.scrapPercentage || 0)) / 100) *
          unitCost
        : 0;

      components.push({
        componentMaterialId: material.id,
        componentMaterialCode: material.sku,
        componentMaterialName: material.name,
        costComponentType: CostComponentType.MATERIAL,
        requiredQuantity: Number(item.quantity),
        quantityUom: item.uom || 'EA',
        scrapPercentage: Number(item.scrapPercentage || 0),
        effectiveQuantity,
        unitCost,
        totalCost: itemTotalCost,
        costSource: this.getCostSource(
          options.costingMethod ?? CostingMethod.STANDARD,
        ),
        costDate: options.costDate ? new Date(options.costDate) : new Date(),
      });

      totalMaterialCost += itemTotalCost;
      totalScrapCost += scrapCost;
    }

    // Calculate labor and overhead costs (simplified - in real implementation, these would come from routing/work center data)
    const totalLaborCost = options.includeLabor
      ? this.calculateLaborCost(bomId, tenantId)
      : 0;
    const totalOverheadCost = options.includeOverhead
      ? this.calculateOverheadCost(bomId, tenantId)
      : 0;

    const totalCost =
      totalMaterialCost + totalLaborCost + totalOverheadCost + totalScrapCost;
    const unitCost = totalCost / (options.outputQuantity || 1);

    return {
      bomId,
      bomCode: bom.code || '',
      bomName: bom.name || '',
      costingMethod: options.costingMethod || CostingMethod.STANDARD,
      totalMaterialCost,
      totalLaborCost,
      totalOverheadCost,
      totalScrapCost,
      totalCost,
      unitCost,
      outputQuantity: options.outputQuantity || 1,
      costUom: options.costUom ?? 'EA',
      costingDate: new Date(),
      components,
      notes: options.notes || undefined,
    };
  }

  /**
   * Save BOM costing to database
   */
  async saveBomCosting(
    bomId: number,
    tenantId: number,
    costingResult: BomCostingResultDto,
    userId: number,
    changeReason?: string,
  ): Promise<BomCosting> {
    return await this.dataSource.transaction(async (manager) => {
      // Deactivate previous costings for this BOM
      await manager.update(
        BomCosting,
        { bomId, isActive: true },
        { isActive: false },
      );

      // Create new BOM costing
      const bomCosting = manager.create(BomCosting, {
        tenantId,
        bomId,
        costingMethod: costingResult.costingMethod as CostingMethod,
        totalMaterialCost: costingResult.totalMaterialCost,
        totalLaborCost: costingResult.totalLaborCost,
        totalOverheadCost: costingResult.totalOverheadCost,
        totalScrapCost: costingResult.totalScrapCost,
        totalCost: costingResult.totalCost,
        unitCost: costingResult.unitCost,
        outputQuantity: costingResult.outputQuantity,
        costUom: costingResult.costUom,
        costingDate: costingResult.costingDate,
        notes: costingResult.notes,
        isActive: true,
        effectiveFrom: new Date(),
      });

      const savedCosting = await manager.save(bomCosting);

      // Save costing components
      for (const component of costingResult.components) {
        const costingComponent = manager.create(BomCostingComponent, {
          tenantId,
          bomCostingId: savedCosting.id,
          componentMaterialId: component.componentMaterialId,
          costComponentType: component.costComponentType as CostComponentType,
          requiredQuantity: component.requiredQuantity,
          quantityUom: component.quantityUom,
          scrapPercentage: component.scrapPercentage,
          effectiveQuantity: component.effectiveQuantity,
          unitCost: component.unitCost,
          totalCost: component.totalCost,
          costSource: component.costSource,
          costDate: component.costDate,
          notes: component.notes,
        });
        await manager.save(costingComponent);
      }

      // Save to history
      if (changeReason) {
        const history = manager.create(BomCostingHistory, {
          tenantId,
          bomId,
          bomCostingId: savedCosting.id,
          costingMethod: costingResult.costingMethod as CostingMethod,
          totalMaterialCost: costingResult.totalMaterialCost,
          totalLaborCost: costingResult.totalLaborCost,
          totalOverheadCost: costingResult.totalOverheadCost,
          totalScrapCost: costingResult.totalScrapCost,
          totalCost: costingResult.totalCost,
          unitCost: costingResult.unitCost,
          outputQuantity: costingResult.outputQuantity,
          costUom: costingResult.costUom,
          costingDate: costingResult.costingDate,
          changeReason,
          changedByUserId: userId,
          notes: costingResult.notes,
        });
        await manager.save(history);
      }

      return savedCosting;
    });
  }

  /**
   * Get BOM costing history
   */
  async getBomCostingHistory(
    bomId: number,
    tenantId: number,
    options: {
      limit?: number;
      offset?: number;
      fromDate?: Date;
      toDate?: Date;
    } = {},
  ): Promise<{ data: BomCostingHistory[]; total: number }> {
    const queryBuilder = this.bomCostingHistoryRepository
      .createQueryBuilder('history')
      .where('history.bomId = :bomId', { bomId })
      .andWhere('history.tenantId = :tenantId', { tenantId })
      .orderBy('history.costingDate', 'DESC');

    if (options.fromDate) {
      queryBuilder.andWhere('history.costingDate >= :fromDate', {
        fromDate: options.fromDate,
      });
    }

    if (options.toDate) {
      queryBuilder.andWhere('history.costingDate <= :toDate', {
        toDate: options.toDate,
      });
    }

    if (options.limit) {
      queryBuilder.take(options.limit);
    }

    if (options.offset) {
      queryBuilder.skip(options.offset);
    }

    const [data, total] = await queryBuilder.getManyAndCount();
    return { data, total };
  }

  /**
   * Get material cost based on costing method
   */
  private async getMaterialCost(
    materialId: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    costingMethod: CostingMethod,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    costDate: Date,
  ): Promise<number> {
    // This is a simplified implementation
    // In a real system, this would integrate with inventory/finance modules
    // to get actual costs based on the costing method

    const material = await this.materialRepository.findOne({
      where: { id: materialId },
    });

    if (!material) {
      throw new Error(`Material with ID ${materialId} not found`);
    }

    // For now, return a placeholder cost
    // In real implementation, this would query from material_cost table or inventory valuation
    return 10.0; // Placeholder
  }

  /**
   * Calculate labor cost for BOM
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private calculateLaborCost(_bomId: number, _tenantId: number): number {
    // Simplified implementation
    // In real system, this would sum up labor operations from routing
    return 0; // Placeholder
  }

  /**
   * Calculate overhead cost for BOM
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private calculateOverheadCost(_bomId: number, _tenantId: number): number {
    // Simplified implementation
    // In real system, this would calculate based on work center overhead rates
    return 0; // Placeholder
  }

  /**
   * Get cost source description
   */
  private getCostSource(costingMethod: CostingMethod): string {
    switch (costingMethod) {
      case CostingMethod.STANDARD:
        return 'Standard Cost';
      case CostingMethod.AVERAGE:
        return 'Average Cost';
      case CostingMethod.FIFO:
        return 'FIFO Cost';
      case CostingMethod.LIFO:
        return 'LIFO Cost';
      case CostingMethod.ACTUAL:
        return 'Actual Cost';
      default:
        return 'Unknown';
    }
  }

  /**
   * Update BOM costing with history tracking
   */
  async updateBomCosting(
    costingId: number,
    tenantId: number,
    updateDto: UpdateBomCostingDto,
    userId: number,
  ): Promise<BomCosting> {
    return await this.dataSource.transaction(async (manager) => {
      // Fetch existing costing with components
      const existingCosting = await manager.findOne(BomCosting, {
        where: { id: costingId, tenantId },
        relations: ['components'],
      });

      if (!existingCosting) {
        throw new Error('BOM costing not found');
      }

      // Store previous values for history
      const previousValues = {
        totalMaterialCost: existingCosting.totalMaterialCost,
        totalLaborCost: existingCosting.totalLaborCost,
        totalOverheadCost: existingCosting.totalOverheadCost,
        totalScrapCost: existingCosting.totalScrapCost,
        totalCost: existingCosting.totalCost,
        unitCost: existingCosting.unitCost,
        outputQuantity: existingCosting.outputQuantity,
        costUom: existingCosting.costUom,
        notes: existingCosting.notes,
        isActive: existingCosting.isActive,
        effectiveFrom: existingCosting.effectiveFrom,
        effectiveTo: existingCosting.effectiveTo,
        components: existingCosting.components.map(
          (comp: BomCostingComponent) => ({
            componentMaterialId: comp.componentMaterialId,
            costComponentType: comp.costComponentType,
            requiredQuantity: comp.requiredQuantity,
            quantityUom: comp.quantityUom,
            unitCost: comp.unitCost,
            totalCost: comp.totalCost,
          }),
        ),
      };

      // Update main costing fields
      if (updateDto.costingMethod !== undefined) {
        existingCosting.costingMethod = updateDto.costingMethod;
      }
      if (updateDto.totalMaterialCost !== undefined) {
        existingCosting.totalMaterialCost = parseFloat(
          Number(updateDto.totalMaterialCost).toFixed(4),
        );
      }
      if (updateDto.totalLaborCost !== undefined) {
        existingCosting.totalLaborCost = parseFloat(
          Number(updateDto.totalLaborCost).toFixed(4),
        );
      }
      if (updateDto.totalOverheadCost !== undefined) {
        existingCosting.totalOverheadCost = parseFloat(
          Number(updateDto.totalOverheadCost).toFixed(4),
        );
      }
      if (updateDto.outputQuantity !== undefined) {
        existingCosting.outputQuantity = Number(updateDto.outputQuantity);
      }
      if (updateDto.costUom !== undefined) {
        existingCosting.costUom = updateDto.costUom;
      }
      if (updateDto.effectiveFrom !== undefined) {
        existingCosting.effectiveFrom = new Date(updateDto.effectiveFrom);
      }
      if (updateDto.effectiveTo !== undefined) {
        existingCosting.effectiveTo = new Date(updateDto.effectiveTo);
      }
      if (updateDto.isActive !== undefined) {
        existingCosting.isActive = updateDto.isActive;
      }
      if (updateDto.notes !== undefined) {
        existingCosting.notes = updateDto.notes;
      }

      // Recalculate totals if needed
      const materialCost = Number(existingCosting.totalMaterialCost || 0);
      const laborCost = Number(existingCosting.totalLaborCost || 0);
      const overheadCost = Number(existingCosting.totalOverheadCost || 0);
      const scrapCost = Number(existingCosting.totalScrapCost || 0);

      existingCosting.totalCost = parseFloat(
        (materialCost + laborCost + overheadCost + scrapCost).toFixed(4),
      );

      if (existingCosting.outputQuantity > 0) {
        existingCosting.unitCost = parseFloat(
          (existingCosting.totalCost / existingCosting.outputQuantity).toFixed(
            4,
          ),
        );
      } else {
        existingCosting.unitCost = 0; // Use 0 instead of null to match type
      }

      // Save updated costing
      const updatedCosting = await manager.save(existingCosting);

      // Create history record
      const history = manager.create(BomCostingHistory, {
        tenantId,
        bomId: existingCosting.bomId,
        bomCostingId: updatedCosting.id,
        costingMethod: updatedCosting.costingMethod,
        totalMaterialCost: updatedCosting.totalMaterialCost,
        totalLaborCost: updatedCosting.totalLaborCost,
        totalOverheadCost: updatedCosting.totalOverheadCost,
        totalScrapCost: updatedCosting.totalScrapCost,
        totalCost: updatedCosting.totalCost,
        unitCost: updatedCosting.unitCost,
        outputQuantity: updatedCosting.outputQuantity,
        costUom: updatedCosting.costUom,
        costingDate: updatedCosting.costingDate,
        changeReason: updateDto.changeReason || 'Manual cost update',
        changedByUserId: userId,
        notes: updatedCosting.notes,
        previousValues: previousValues,
      });

      await manager.save(history);

      return updatedCosting;
    });
  }
}
