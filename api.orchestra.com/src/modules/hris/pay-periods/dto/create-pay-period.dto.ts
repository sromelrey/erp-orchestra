import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { PayPeriodStatus } from '@/entities';

export class CreatePayPeriodDto {
  @ApiProperty({
    example: 'March 2026 - First Half',
    description: 'Display name for the pay period',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '2026-03-01',
    description: 'Start date of the period',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-03-15', description: 'End date of the period' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    example: 'OPEN',
    description: 'Current status of the pay period',
    enum: PayPeriodStatus,
    default: PayPeriodStatus.OPEN,
  })
  @IsEnum(PayPeriodStatus)
  status: PayPeriodStatus;
}
