import {
  IsEnum,
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
    description: 'Unique subdomain for the tenant',
    example: 'acme-corp',
  })
  @IsString()
  @IsNotEmpty()
  subdomain: string;

  @ApiProperty({
    description: 'Current status of the tenant',
    enum: TenantStatus,
    default: TenantStatus.TRIAL,
  })
  @IsEnum(TenantStatus)
  @IsOptional()
  status?: TenantStatus = TenantStatus.TRIAL;

  @ApiProperty({
    description:
      'Name of the subscription plan (e.g., Starter, Professional, Enterprise)',
    example: 'Enterprise',
  })
  @IsString()
  @IsNotEmpty()
  plan: string;

  @ApiProperty({
    description: 'URL to the tenant logo',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
