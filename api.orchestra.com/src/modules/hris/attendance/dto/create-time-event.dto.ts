import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject } from 'class-validator';

export class CreateTimeEventDto {
  @ApiPropertyOptional({ description: 'Location coordinates' })
  @IsOptional()
  @IsObject()
  location?: { lat: number; lng: number; accuracy?: number };

  @ApiPropertyOptional({
    description: 'Device information captured from frontend',
  })
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
