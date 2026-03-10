import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
  IsEnum,
  IsPositive,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateCompensationDto {
  @ApiProperty({
    description: 'Base salary amount',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  baseSalary?: number;

  @ApiProperty({
    description: 'Hourly rate for hourly employees',
    example: 25.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  hourlyRate?: number;

  @ApiProperty({
    description: 'Overtime rate multiplier',
    example: 1.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  overtimeRate?: number;

  @ApiProperty({
    description: 'Effective date for this compensation',
    example: '2024-01-01',
  })
  @IsDateString()
  effectiveDate: string;

  @ApiProperty({
    description: 'End date for this compensation (optional)',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiProperty({
    description: 'Payment frequency',
    example: 'monthly',
    enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'],
    default: 'monthly',
  })
  @IsOptional()
  @IsEnum(['weekly', 'bi-weekly', 'semi-monthly', 'monthly'])
  paymentFrequency?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly' =
    'monthly';

  @ApiProperty({
    description: 'Reason for this compensation change',
    example: 'Annual salary review',
    required: false,
  })
  @IsOptional()
  @IsString()
  changeReason?: string;
}

export class UpdateCompensationDto {
  @ApiProperty({
    description: 'Base salary amount',
    example: 55000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  baseSalary?: number;

  @ApiProperty({
    description: 'Hourly rate for hourly employees',
    example: 28.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  hourlyRate?: number;

  @ApiProperty({
    description: 'Overtime rate multiplier',
    example: 1.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  overtimeRate?: number;

  @ApiProperty({
    description: 'Effective date for this compensation',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  effectiveDate?: string;

  @ApiProperty({
    description: 'End date for this compensation',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Payment frequency',
    example: 'monthly',
    enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['weekly', 'bi-weekly', 'semi-monthly', 'monthly'])
  paymentFrequency?: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';

  @ApiProperty({
    description: 'Whether this compensation record is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Reason for this compensation change',
    example: 'Mid-year adjustment',
    required: false,
  })
  @IsOptional()
  @IsString()
  changeReason?: string;
}
