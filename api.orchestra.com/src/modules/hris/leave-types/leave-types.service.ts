import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveType } from '@/entities';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dto/leave-type.dto';

@Injectable()
export class LeaveTypesService {
  constructor(
    @InjectRepository(LeaveType)
    private readonly leaveTypeRepository: Repository<LeaveType>,
  ) {}

  async create(dto: CreateLeaveTypeDto, tenantId: number, userId: number) {
    const leaveType = this.leaveTypeRepository.create({
      ...dto,
      tenantId,
      createdBy: userId,
      updatedBy: userId,
    });
    return await this.leaveTypeRepository.save(leaveType);
  }

  async findAll(tenantId: number) {
    return await this.leaveTypeRepository.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number, tenantId: number) {
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id, tenantId },
    });
    if (!leaveType) {
      throw new NotFoundException(`Leave Type with ID ${id} not found`);
    }
    return leaveType;
  }

  async update(
    id: number,
    dto: UpdateLeaveTypeDto,
    tenantId: number,
    userId: number,
  ) {
    const leaveType = await this.findOne(id, tenantId);
    Object.assign(leaveType, dto);
    leaveType.updatedBy = userId;
    return await this.leaveTypeRepository.save(leaveType);
  }

  async remove(id: number, tenantId: number) {
    const leaveType = await this.findOne(id, tenantId);
    return await this.leaveTypeRepository.softRemove(leaveType);
  }
}
