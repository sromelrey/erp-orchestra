import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ProductionWorkOrderDto {
  @IsNotEmpty()
  @IsString()
  stepName: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
