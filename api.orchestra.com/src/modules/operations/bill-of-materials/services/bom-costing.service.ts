import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bom, BomItem, Material } from '@/entities';
import { BomCostResult } from '../types';

interface BomWithItems extends Bom {
  items: BomItem[];
}

interface MaterialWithCost extends Material {
  standardCost?: number;
}

@Injectable()
export class BomCostingService {
  constructor(
    @InjectRepository(Bom)
    private bomRepository: Repository<Bom>,
    @InjectRepository(BomItem)
    private bomItemRepository: Repository<BomItem>,
    @InjectRepository(Material)
    private materialRepository: Repository<Material>,
  ) {}

  /**
   * Calculate the total cost of a BOM based on component costs
   */
  async calculateBomCost(bomId: number): Promise<BomCostResult> {
    const bom = await this.bomRepository.findOne({
      where: { id: bomId },
      relations: ['items'],
    });

    if (!bom) {
      throw new Error('BOM not found');
    }

    const componentCosts: Array<{
      componentMaterialId: number;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }> = [];
    let totalCost = 0;

    for (const item of (bom as BomWithItems).items) {
      // Get material cost (this would typically come from a costing module)
      const material = (await this.materialRepository.findOne({
        where: { id: item.componentMaterialId },
      })) as MaterialWithCost;

      const unitCost = material?.standardCost || 0; // Assuming standardCost field exists
      const itemTotalCost = Number(item.quantity) * unitCost;

      componentCosts.push({
        componentMaterialId: item.componentMaterialId,
        quantity: Number(item.quantity),
        unitCost,
        totalCost: itemTotalCost,
      });

      totalCost += itemTotalCost;
    }

    return {
      bomId,
      totalCost,
      componentCosts,
    };
  }

  /**
   * Get cost breakdown for a BOM including scrap costs
   */
  async getCostBreakdown(bomId: number): Promise<BomCostResult> {
    const bom = await this.bomRepository.findOne({
      where: { id: bomId },
      relations: ['items'],
    });

    if (!bom) {
      throw new Error('BOM not found');
    }

    const componentCosts: Array<{
      componentMaterialId: number;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }> = [];
    let totalCost = 0;

    for (const item of (bom as BomWithItems).items) {
      const material = (await this.materialRepository.findOne({
        where: { id: item.componentMaterialId },
      })) as MaterialWithCost;

      const unitCost = material?.standardCost || 0;

      // Include scrap percentage in cost calculation
      const effectiveQuantity =
        Number(item.quantity) * (1 + Number(item.scrapPercentage) / 100);
      const itemTotalCost = effectiveQuantity * unitCost;

      componentCosts.push({
        componentMaterialId: item.componentMaterialId,
        quantity: effectiveQuantity,
        unitCost,
        totalCost: itemTotalCost,
      });

      totalCost += itemTotalCost;
    }

    return {
      bomId,
      totalCost,
      componentCosts,
    };
  }
}
