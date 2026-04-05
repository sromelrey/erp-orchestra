import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ApproveGoodsIssuanceDto {
  @ApiPropertyOptional({
    example: 'Approved for production',
    description: 'Approval notes',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
