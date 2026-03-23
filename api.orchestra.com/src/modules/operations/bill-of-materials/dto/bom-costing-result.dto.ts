export class BomCostingComponentDto {
  componentMaterialId: number;
  componentMaterialCode?: string;
  componentMaterialName?: string;
  costComponentType: string;
  requiredQuantity: number;
  quantityUom: string;
  scrapPercentage: number;
  effectiveQuantity: number;
  unitCost: number;
  totalCost: number;
  costSource?: string;
  costDate?: Date;
  notes?: string;
}

export class BomCostingResultDto {
  bomId: number;
  bomCode?: string;
  bomName?: string;
  costingMethod: string;
  totalMaterialCost: number;
  totalLaborCost: number;
  totalOverheadCost: number;
  totalScrapCost: number;
  totalCost: number;
  unitCost: number;
  outputQuantity: number;
  costUom: string;
  costingDate: Date;
  components: BomCostingComponentDto[];
  notes?: string;
}

export class BomCostComparisonDto {
  currentCosting: BomCostingResultDto;
  previousCosting?: BomCostingResultDto;
  costDifference: number;
  percentageChange: number;
  componentChanges: {
    componentMaterialId: number;
    componentMaterialName?: string;
    previousCost: number;
    currentCost: number;
    difference: number;
    percentageChange: number;
  }[];
}
