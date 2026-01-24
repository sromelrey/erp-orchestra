import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({ example: 'Enterprise', description: 'Name of the plan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 99.99, description: 'Monthly price', default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monthlyPrice: number;

  @ApiProperty({ example: 50, description: 'Maximum number of users' })
  @IsInt()
  @Min(1)
  maxUsers: number;

  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Array of System Module IDs to include',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  moduleIds?: number[];
}
