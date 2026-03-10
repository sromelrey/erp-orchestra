import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { LeaveRequestStatus } from '@/entities';

export class CreateLeaveRequestDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  leaveTypeId: number;

  @ApiProperty({ example: '2026-03-20' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-03-25' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateLeaveRequestStatusDto {
  @ApiProperty({ enum: LeaveRequestStatus })
  @IsEnum(LeaveRequestStatus)
  status: LeaveRequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
