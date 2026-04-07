import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveredItemDto {
  @ApiProperty({ example: 1, description: 'Order Item ID' })
  @IsNumber()
  @Min(1)
  orderItemId: number;

  @ApiProperty({ example: 5, description: 'Quantity delivered' })
  @IsNumber()
  @Min(0.000001)
  deliveredQuantity: number;
}

export class ConfirmSalesOrderDto {
  @ApiPropertyOptional({
    example: 'Order confirmed for immediate processing',
    description: 'Confirmation Notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'Approver User ID' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  approvedBy?: number;
}

export class ShipSalesOrderDto {
  @ApiPropertyOptional({
    example: 'Shipped via express delivery',
    description: 'Shipping Notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'Shipper User ID' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  shippedBy?: number;
}

export class DeliverSalesOrderDto {
  @ApiProperty({
    type: [DeliveredItemDto],
    description: 'List of items being delivered',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveredItemDto)
  deliveredItems: DeliveredItemDto[];

  @ApiPropertyOptional({
    example: 'Items delivered successfully',
    description: 'Delivery Notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 1, description: 'Delivery Person User ID' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  deliveredBy?: number;
}

export class CancelSalesOrderDto {
  @ApiProperty({
    example: 'Customer requested cancellation',
    description: 'Cancellation Reason',
  })
  @IsString()
  reason: string;

  @ApiPropertyOptional({
    example: 'Will refund payment within 5 business days',
    description: 'Additional Notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
