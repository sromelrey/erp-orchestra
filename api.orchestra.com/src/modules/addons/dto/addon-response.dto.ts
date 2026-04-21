import { Expose } from 'class-transformer';

export class AddonResponseDto {
  @Expose()
  id: number;

  @Expose()
  tenantId: number;

  @Expose()
  code: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  type: 'PHYSICAL' | 'SERVICE';

  @Expose()
  basePrice: number;

  @Expose()
  materialId?: number;

  @Expose()
  isActive: boolean;
}
