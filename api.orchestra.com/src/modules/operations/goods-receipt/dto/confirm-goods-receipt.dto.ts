import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ConfirmGoodsReceiptDto {
  @ApiPropertyOptional({
    description: 'Confirmation notes',
    example: 'All items verified and counted',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
