import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod } from '@/entities';

/**
 * Manages pay cycle configurations.
 */
@Injectable()
export class PayPeriodsService {
  constructor(
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepository: Repository<PayPeriod>,
  ) {}

  /**
   * Creates a new pay period record.
   */
  async create(
    createPayPeriodDto: CreatePayPeriodDto,
    tenantId: number,
  ): Promise<PayPeriod> {
    const payPeriod = this.payPeriodRepository.create({
      ...createPayPeriodDto,
      tenantId,
    });
    return this.payPeriodRepository.save(payPeriod);
  }

  /**
   * Retrieves all pay periods for a tenant.
   */
  async findAll(tenantId: number): Promise<PayPeriod[]> {
    return this.payPeriodRepository.find({
      where: { tenantId },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Finds a specific pay period by ID.
   */
  async findOne(id: number, tenantId: number): Promise<PayPeriod> {
    const payPeriod = await this.payPeriodRepository.findOne({
      where: { id, tenantId },
    });
    if (!payPeriod) {
      throw new NotFoundException(`Pay period #${id} not found`);
    }
    return payPeriod;
  }

  /**
   * Updates an existing pay period.
   */
  async update(
    id: number,
    updatePayPeriodDto: UpdatePayPeriodDto,
    tenantId: number,
  ): Promise<PayPeriod> {
    const payPeriod = await this.findOne(id, tenantId);
    Object.assign(payPeriod, updatePayPeriodDto);
    return this.payPeriodRepository.save(payPeriod);
  }

  /**
   * Deletes a pay period.
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const payPeriod = await this.findOne(id, tenantId);
    await this.payPeriodRepository.remove(payPeriod);
  }
}
