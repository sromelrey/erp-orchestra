import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class TriggerPayrollRunDto {
  @ApiProperty({ description: 'Pay period to run payroll for' })
  @IsInt()
  @Min(1)
  payPeriodId: number;

  @ApiProperty({
    description: 'Force re-run even if payslips exist',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
