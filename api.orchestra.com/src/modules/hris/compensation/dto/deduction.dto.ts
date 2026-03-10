import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class CreateDeductionDto {
  @ApiProperty({
    description: 'Name of the deduction',
    example: 'Health Insurance',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of deduction',
    example: 'fixed',
    enum: ['fixed', 'percentage', 'recurring', 'variable'],
  })
  @IsEnum(['fixed', 'percentage', 'recurring', 'variable'])
  type: 'fixed' | 'percentage' | 'recurring' | 'variable';

  @ApiProperty({
    description: 'Fixed amount to deduct',
    example: 150.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiProperty({
    description: 'Percentage to deduct (for percentage-based deductions)',
    example: 5.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  percentage?: number;

  @ApiProperty({
    description: 'Deduction frequency',
    example: 'monthly',
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
  })
  @IsEnum(['one-time', 'monthly', 'quarterly', 'annually'])
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';

  @ApiProperty({
    description: 'Effective date for this deduction',
    example: '2024-01-01',
  })
  @IsDateString()
  effectiveDate: string;

  @ApiProperty({
    description: 'End date for this deduction (optional)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Additional description or notes',
    example: 'Company-sponsored health insurance premium',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDeductionDto {
  @ApiProperty({
    description: 'Name of the deduction',
    example: 'Health Insurance Premium',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Type of deduction',
    example: 'fixed',
    enum: ['fixed', 'percentage', 'recurring', 'variable'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['fixed', 'percentage', 'recurring', 'variable'])
  type?: 'fixed' | 'percentage' | 'recurring' | 'variable';

  @ApiProperty({
    description: 'Fixed amount to deduct',
    example: 175.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiProperty({
    description: 'Percentage to deduct',
    example: 6.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  percentage?: number;

  @ApiProperty({
    description: 'Deduction frequency',
    example: 'monthly',
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['one-time', 'monthly', 'quarterly', 'annually'])
  frequency?: 'one-time' | 'monthly' | 'quarterly' | 'annually';

  @ApiProperty({
    description: 'Effective date for this deduction',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiProperty({
    description: 'End date for this deduction',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Additional description or notes',
    example: 'Updated premium amount',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Whether this deduction is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
