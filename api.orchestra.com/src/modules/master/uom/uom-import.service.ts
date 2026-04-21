import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitOfMeasure } from '@/entities/inventory/unit-of-measure.entity';
import { ImportUomDto } from './dto/import-uom.dto';
import {
  BaseImportService,
  ImportResult,
} from '@/common/import/base-import.service';

@Injectable()
export class UomImportService extends BaseImportService<
  UnitOfMeasure,
  ImportUomDto
> {
  constructor(
    @InjectRepository(UnitOfMeasure)
    private uomRepository: Repository<UnitOfMeasure>,
  ) {
    super();
  }

  validateRow(row: any): { valid: boolean; error?: string } {
    // Check required fields
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (!row.code || typeof row.code !== 'string' || row.code.trim() === '') {
      return { valid: false, error: 'Code is required and must be a string' };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    if (!row.name || typeof row.name !== 'string' || row.name.trim() === '') {
      return { valid: false, error: 'Name is required and must be a string' };
    }

    // Check code length
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (row.code.length > 32) {
      return { valid: false, error: 'Code must be 32 characters or less' };
    }

    // Check name length
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (row.name.length > 255) {
      return { valid: false, error: 'Name must be 255 characters or less' };
    }

    // Check precision if provided
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (row.precision !== undefined && row.precision !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      const precision = parseInt(row.precision);
      if (isNaN(precision) || precision < 0 || precision > 6) {
        return {
          valid: false,
          error: 'Precision must be a number between 0 and 6',
        };
      }
    }

    return { valid: true };
  }

  transformRow(row: any): ImportUomDto {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      code: row.code.trim().toUpperCase(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      name: row.name.trim(),
      precision:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        row.precision !== undefined && row.precision !== null
          ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
            parseInt(row.precision)
          : 2,
    };
  }

  async checkDuplicate(data: ImportUomDto, tenantId: number): Promise<boolean> {
    const existing = await this.uomRepository.findOne({
      where: {
        tenantId,
        code: data.code,
      },
      withDeleted: true,
    });

    return !!existing && existing.deletedAt === null;
  }

  async insertData(
    data: ImportUomDto,
    tenantId: number,
  ): Promise<UnitOfMeasure> {
    const uom = this.uomRepository.create({
      tenantId,
      code: data.code,
      name: data.name,
      precision: data.precision || 2,
    });

    return await this.uomRepository.save(uom);
  }

  async updateData(id: number, data: ImportUomDto): Promise<UnitOfMeasure> {
    const uom = await this.uomRepository.findOne({
      where: { id },
    });

    if (!uom) {
      throw new Error(`UOM with ID ${id} not found`);
    }

    uom.name = data.name;
    uom.precision = data.precision || 2;

    return await this.uomRepository.save(uom);
  }

  importFromFile(): ImportResult<UnitOfMeasure> {
    // This will be implemented with xlsx library
    // For now, return an error
    return {
      total: 0,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [
        {
          row: 0,
          field: 'file',
          message:
            'Excel parsing not yet implemented. Please install xlsx library.',
        },
      ],
    };
  }
}
