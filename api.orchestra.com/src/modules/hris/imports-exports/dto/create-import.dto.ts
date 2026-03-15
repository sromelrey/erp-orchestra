import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateImportDto {
  @ApiProperty({
    description: 'Storage key of the uploaded file (e.g., S3/minio)',
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;

  @ApiProperty({
    description: 'Dataset to import (employees, timesheets, payslips)',
  })
  @IsString()
  @IsNotEmpty()
  dataset: string;

  @ApiProperty({
    description: 'Optional client trace ID for idempotency',
    required: false,
  })
  @IsString()
  @IsOptional()
  clientRequestId?: string;
}
