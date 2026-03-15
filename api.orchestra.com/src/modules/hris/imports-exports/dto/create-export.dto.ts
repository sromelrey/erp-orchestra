import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExportDto {
  @ApiProperty({
    description: 'Dataset to export (employees, timesheets, payslips)',
  })
  @IsString()
  @IsNotEmpty()
  dataset: string;

  @ApiProperty({
    description: 'Optional target file key to store generated export',
    required: false,
  })
  @IsString()
  @IsOptional()
  fileKey?: string;

  @ApiProperty({
    description: 'Optional client trace ID for idempotency',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientRequestId?: string;
}
