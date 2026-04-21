import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsInt, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

export class ListItemsDto extends CursorPaginationDto {
  @ApiPropertyOptional({ description: 'Search by item code' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => Number(value))
  categoryId?: number;
}
