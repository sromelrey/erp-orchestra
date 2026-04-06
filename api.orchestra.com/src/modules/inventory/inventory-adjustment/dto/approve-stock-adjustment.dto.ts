import { IsOptional, IsString } from 'class-validator';

export class ApproveStockAdjustmentDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
