export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportResult<T = any> {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  errors: ImportError[];
  data?: T[];
}

export interface ImportOptions {
  skipExisting?: boolean;
  updateExisting?: boolean;
}

export abstract class BaseImportService<T, D> {
  abstract validateRow(
    row: any,
    index: number,
  ): { valid: boolean; error?: string };
  abstract transformRow(row: any): D;
  abstract checkDuplicate(data: D, tenantId: number): Promise<boolean>;
  abstract insertData(data: D, tenantId: number): Promise<T>;
  abstract updateData(id: number, data: D): Promise<T>;

  async import(
    rows: any[],
    tenantId: number,
    options: ImportOptions = {},
  ): Promise<ImportResult<T>> {
    const { skipExisting = true, updateExisting = false } = options;

    const result: ImportResult<T> = {
      total: rows.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
      data: [] as T[],
    };

    for (let i = 0; i < rows.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const row = rows[i];
      const rowIndex = i + 1;

      try {
        // Validate row
        const validation = this.validateRow(row, rowIndex);
        if (!validation.valid) {
          result.failed++;
          result.errors.push({
            row: rowIndex,
            field: 'general',
            message: validation.error || 'Invalid row data',
          });
          continue;
        }

        // Transform row to DTO
        const dto = this.transformRow(row);

        // Check for duplicates
        const isDuplicate = await this.checkDuplicate(dto, tenantId);

        if (isDuplicate) {
          if (skipExisting && !updateExisting) {
            result.skipped++;
            continue;
          }

          if (updateExisting) {
            // Update existing record
            const existingId = (dto as { id?: number }).id;
            if (existingId) {
              const updated = await this.updateData(existingId, dto);
              result.success++;
              result.data?.push(updated);
              continue;
            }
          }
        }

        // Insert new record
        const inserted = await this.insertData(dto, tenantId);
        result.success++;
        result.data?.push(inserted);
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: rowIndex,
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }
}
