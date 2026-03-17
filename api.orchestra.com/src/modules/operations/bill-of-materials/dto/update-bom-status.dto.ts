import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBomStatusDto {
  @ApiPropertyOptional({ description: 'BOM status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Is active flag' })
  @IsOptional()
  isActive?: boolean;
}
