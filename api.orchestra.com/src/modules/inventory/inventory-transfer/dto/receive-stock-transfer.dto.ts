import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiveStockTransferItemDto {
  @IsNumber()
  @IsNotEmpty()
  stockTransferItemId: number;

  @IsNumber()
  @IsNotEmpty()
  quantityReceived: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReceiveStockTransferDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceiveStockTransferItemDto)
  items: ReceiveStockTransferItemDto[];
}
