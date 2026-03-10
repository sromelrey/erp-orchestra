import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  EmployeeCompensation,
  EmployeeDeduction,
  CompensationHistory,
} from '@/entities';

/**
 * Service responsible for managing employee compensation and deductions.
 * Handles CRUD operations, history tracking, and business logic for payroll calculations.
 */
@Injectable()
export class CompensationService {
  constructor(
    @InjectRepository(EmployeeCompensation)
    private readonly compensationRepository: Repository<EmployeeCompensation>,
    @InjectRepository(EmployeeDeduction)
    private readonly deductionRepository: Repository<EmployeeDeduction>,
    @InjectRepository(CompensationHistory)
    private readonly historyRepository: Repository<CompensationHistory>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves all active compensation records for an employee.
   */
  async findEmployeeCompensation(
    employeeId: number,
  ): Promise<EmployeeCompensation[]> {
    return this.compensationRepository.find({
      where: {
        employeeId,
        isActive: true,
      },
      order: {
        effectiveDate: 'DESC',
      },
    });
  }

  /**
   * Creates a new compensation record with history tracking.
   */
  async createCompensation(
    employeeId: number,
    compensationData: Partial<EmployeeCompensation>,
    changedBy?: number,
    reason?: string,
  ): Promise<EmployeeCompensation> {
    return await this.dataSource.transaction(async (manager) => {
      // Ensure effectiveDate is provided
      if (!compensationData.effectiveDate) {
        throw new BadRequestException(
          'Effective date is required for compensation creation',
        );
      }

      // Validate no overlapping effective dates
      await this.validateCompensationDates(
        employeeId,
        compensationData.effectiveDate,
        compensationData.endDate,
      );

      const compensation = manager.create(EmployeeCompensation, {
        ...compensationData,
        employeeId,
      });

      const saved = await manager.save(compensation);

      // Log to history
      if (changedBy) {
        await this.logCompensationChange(saved, null, saved, changedBy, reason);
      }

      return saved;
    });
  }

  /**
   * Updates an existing compensation record with history tracking.
   */
  async updateCompensation(
    id: number,
    employeeId: number,
    updates: Partial<EmployeeCompensation>,
    changedBy?: number,
    reason?: string,
  ): Promise<EmployeeCompensation> {
    return await this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(EmployeeCompensation, {
        where: { id, employeeId },
      });

      if (!existing) {
        throw new NotFoundException('Compensation record not found');
      }

      // Validate date changes
      if (updates.effectiveDate || updates.endDate) {
        await this.validateCompensationDates(
          employeeId,
          updates.effectiveDate || existing.effectiveDate,
          updates.endDate || existing.endDate,
          id,
        );
      }

      const updated = await manager.save(EmployeeCompensation, {
        ...existing,
        ...updates,
      });

      // Log to history
      if (changedBy) {
        await this.logCompensationChange(
          updated,
          existing,
          updated,
          changedBy,
          reason,
        );
      }

      return updated;
    });
  }

  /**
   * Soft deletes a compensation record.
   */
  async removeCompensation(
    id: number,
    employeeId: number,
    changedBy?: number,
    reason?: string,
  ): Promise<void> {
    const compensation = await this.compensationRepository.findOne({
      where: { id, employeeId },
    });

    if (!compensation) {
      throw new NotFoundException('Compensation record not found');
    }

    // Log to history before deletion
    if (changedBy) {
      await this.logCompensationChange(
        compensation,
        compensation,
        null,
        changedBy,
        reason,
      );
    }

    await this.compensationRepository.softRemove(compensation);
  }

  /**
   * Retrieves all deductions for an employee.
   */
  async findEmployeeDeductions(
    employeeId: number,
  ): Promise<EmployeeDeduction[]> {
    return this.deductionRepository.find({
      where: {
        employeeId,
        isActive: true,
      },
      order: {
        effectiveDate: 'DESC',
      },
    });
  }

  /**
   * Creates a new deduction record.
   */
  async createDeduction(
    employeeId: number,
    deductionData: Partial<EmployeeDeduction>,
  ): Promise<EmployeeDeduction> {
    const deduction = this.deductionRepository.create({
      ...deductionData,
      employeeId,
    });

    return this.deductionRepository.save(deduction);
  }

  /**
   * Updates an existing deduction record.
   */
  async updateDeduction(
    id: number,
    employeeId: number,
    updates: Partial<EmployeeDeduction>,
  ): Promise<EmployeeDeduction> {
    const existing = await this.deductionRepository.findOne({
      where: { id, employeeId },
    });

    if (!existing) {
      throw new NotFoundException('Deduction record not found');
    }

    return this.deductionRepository.save({
      ...existing,
      ...updates,
    });
  }

  /**
   * Removes a deduction record.
   */
  async removeDeduction(id: number, employeeId: number): Promise<void> {
    const deduction = await this.deductionRepository.findOne({
      where: { id, employeeId },
    });

    if (!deduction) {
      throw new NotFoundException('Deduction record not found');
    }

    await this.deductionRepository.softRemove(deduction);
  }

  /**
   * Calculates total compensation for an employee on a given date.
   */
  async calculateTotalCompensation(
    employeeId: number,
    date: Date,
  ): Promise<{
    baseSalary: number;
    hourlyRate?: number;
    overtimeRate?: number;
    currency: string;
  }> {
    const compensation = await this.compensationRepository
      .createQueryBuilder('comp')
      .where('comp.employeeId = :employeeId', { employeeId })
      .andWhere('comp.effectiveDate <= :date', { date })
      .andWhere('(comp.endDate IS NULL OR comp.endDate >= :date)', { date })
      .andWhere('comp.isActive = true')
      .orderBy('comp.effectiveDate', 'DESC')
      .getOne();

    if (!compensation) {
      throw new NotFoundException(
        'No active compensation found for the specified date',
      );
    }

    return {
      baseSalary: compensation.baseSalary || 0,
      hourlyRate: compensation.hourlyRate,
      overtimeRate: compensation.overtimeRate,
      currency: compensation.currency,
    };
  }

  /**
   * Calculates total deductions for an employee on a given date.
   */
  async calculateTotalDeductions(
    employeeId: number,
    date: Date,
  ): Promise<number> {
    const deductions = await this.deductionRepository
      .createQueryBuilder('ded')
      .where('ded.employeeId = :employeeId', { employeeId })
      .andWhere('ded.effectiveDate <= :date', { date })
      .andWhere('(ded.endDate IS NULL OR ded.endDate >= :date)', { date })
      .andWhere('ded.isActive = true')
      .getMany();

    return deductions.reduce((total, deduction) => {
      if (deduction.type === 'fixed' && deduction.amount) {
        return total + deduction.amount;
      }
      // Percentage-based deductions need gross pay context, handled elsewhere
      return total;
    }, 0);
  }

  /**
   * Retrieves compensation history for an employee.
   */
  async getCompensationHistory(
    employeeId: number,
  ): Promise<CompensationHistory[]> {
    return this.historyRepository.find({
      where: { employeeId },
      order: { changedAt: 'DESC' },
    });
  }

  /**
   * Validates that compensation dates don't overlap.
   */
  private async validateCompensationDates(
    employeeId: number,
    effectiveDate: Date,
    endDate?: Date,
    excludeId?: number,
  ): Promise<void> {
    const query = this.compensationRepository
      .createQueryBuilder('comp')
      .where('comp.employeeId = :employeeId', { employeeId })
      .andWhere('comp.isActive = true');

    if (excludeId) {
      query.andWhere('comp.id != :excludeId', { excludeId });
    }

    // Check for overlapping date ranges
    const overlaps = await query
      .andWhere(
        '(comp.effectiveDate <= :endDate OR :endDate IS NULL) AND ' +
          '(:effectiveDate <= comp.endDate OR comp.endDate IS NULL)',
        { effectiveDate, endDate },
      )
      .getCount();

    if (overlaps > 0) {
      throw new BadRequestException(
        'Compensation dates overlap with existing records',
      );
    }
  }

  /**
   * Logs compensation changes to history.
   */
  private async logCompensationChange(
    compensation: EmployeeCompensation,
    oldValue: EmployeeCompensation | null,
    newValue: EmployeeCompensation | null,
    changedBy: number,
    reason?: string,
  ): Promise<void> {
    const changes: Array<{
      field: string;
      oldValue: string | undefined;
      newValue: string | undefined;
    }> = [];

    // Compare fields that should be tracked
    const trackableFields = [
      'baseSalary',
      'hourlyRate',
      'overtimeRate',
      'currency',
      'paymentFrequency',
    ];

    for (const field of trackableFields) {
      const oldVal = oldValue?.[field as keyof EmployeeCompensation];
      const newVal = newValue?.[field as keyof EmployeeCompensation];

      if (oldVal !== newVal) {
        // Only handle primitive types for history logging
        const oldStr =
          typeof oldVal === 'string' ||
          typeof oldVal === 'number' ||
          typeof oldVal === 'boolean'
            ? String(oldVal)
            : undefined;
        const newStr =
          typeof newVal === 'string' ||
          typeof newVal === 'number' ||
          typeof newVal === 'boolean'
            ? String(newVal)
            : undefined;

        changes.push({
          field,
          oldValue: oldStr,
          newValue: newStr,
        });
      }
    }

    // Create history records for each changed field
    for (const change of changes) {
      const historyRecord: Partial<CompensationHistory> = {
        employeeId: compensation.employeeId,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changedBy,
        changeReason: reason,
      };
      await this.historyRepository.save(historyRecord);
    }
  }
}
