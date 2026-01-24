import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  DELETED = 'deleted',
}

export class CreateTenantDto {
  @ApiProperty({
    description: 'The name of the tenant (company)',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique slug for the tenant (subdomain)',
    example: 'acme-corp',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Current status of the tenant',
    enum: TenantStatus,
    default: TenantStatus.TRIAL,
  })
  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus = TenantStatus.TRIAL;

  @ApiProperty({
    description: 'ID of the subscription plan',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  planId: number;

  @ApiProperty({
    description: 'URL to the tenant logo',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
