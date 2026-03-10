import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TimesheetStatus } from '@/entities';

export class UpdateTimesheetStatusDto {
  @ApiProperty({
    example: 'APPROVED',
    description: 'New status for the timesheet',
    enum: TimesheetStatus,
  })
  @IsEnum(TimesheetStatus)
  @IsNotEmpty()
  status: TimesheetStatus;
}
