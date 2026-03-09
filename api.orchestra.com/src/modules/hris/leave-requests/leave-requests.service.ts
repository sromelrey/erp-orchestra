import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  LeaveRequest,
  LeaveRequestStatus,
} from '@/entities/hris/leave-request.entity';
import { Employee } from '@/entities/hris/employee.entity';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestStatusDto,
} from './dto/leave-request.dto';

@Injectable()
export class LeaveRequestsService {
  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateLeaveRequestDto, tenantId: number, userId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { userId, tenantId, deletedAt: IsNull() },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user.');
    }

    const leaveRequest = this.leaveRequestRepository.create({
      employeeId: employee.id,
      leaveTypeId: dto.leaveTypeId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      reason: dto.reason,
      status: LeaveRequestStatus.PENDING,
      tenantId,
      createdBy: userId,
      updatedBy: userId,
    });

    return await this.leaveRequestRepository.save(leaveRequest);
  }

  async findByUser(userId: number, tenantId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { userId, tenantId, deletedAt: IsNull() },
    });

    if (!employee) {
      return [];
    }

    return await this.findAll(tenantId, employee.id);
  }

  async findAll(tenantId: number, employeeId?: number) {
    const where: { tenantId: number; employeeId?: number } = { tenantId };
    if (employeeId) {
      where.employeeId = employeeId;
    }

    return await this.leaveRequestRepository.find({
      where,
      relations: ['employee', 'leaveType', 'approver'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, tenantId: number) {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id, tenantId },
      relations: ['employee', 'leaveType', 'approver'],
    });
    if (!leaveRequest) {
      throw new NotFoundException(`Leave Request with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async updateStatus(
    id: number,
    dto: UpdateLeaveRequestStatusDto,
    tenantId: number,
    userId: number,
  ) {
    const leaveRequest = await this.findOne(id, tenantId);

    // Only pending requests can be approved/rejected
    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be updated.');
    }

    const approver = await this.employeeRepository.findOne({
      where: { userId, tenantId, deletedAt: IsNull() },
    });

    leaveRequest.status = dto.status;
    leaveRequest.approvedById = approver ? approver.id : undefined;
    leaveRequest.comments = dto.comment;
    leaveRequest.approvedAt = new Date();
    leaveRequest.updatedBy = userId;

    return await this.leaveRequestRepository.save(leaveRequest);
  }
}
