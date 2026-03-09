import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { TimeEvent, TimeEventType } from '@/entities/hris/time-event.entity';
import { Employee } from '@/entities/hris/employee.entity';
import { CreateTimeEventDto } from './dto/create-time-event.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(TimeEvent)
    private readonly timeEventRepository: Repository<TimeEvent>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  /**
   * Records a clock-in event for the authenticated user.
   */
  async clockIn(
    userId: number,
    tenantId: number,
    ipAddress: string,
    dto: CreateTimeEventDto,
  ) {
    const employee = await this.getEmployeeForUser(userId, tenantId);

    // Check if already clocked in today without a clock out
    const lastEvent = await this.getLastEventToday(employee.id, tenantId);
    if (lastEvent && lastEvent.type === TimeEventType.CLOCK_IN) {
      throw new BadRequestException('You are already clocked in.');
    }

    const timeEvent = this.timeEventRepository.create({
      employeeId: employee.id,
      type: TimeEventType.CLOCK_IN,
      timestamp: new Date(),
      location: dto.location,
      ipAddress,
      deviceInfo: dto.deviceInfo,
      tenantId: tenantId,
      createdBy: userId,
      updatedBy: userId,
    });

    return await this.timeEventRepository.save(timeEvent);
  }

  /**
   * Records a clock-out event for the authenticated user.
   */
  async clockOut(
    userId: number,
    tenantId: number,
    ipAddress: string,
    dto: CreateTimeEventDto,
  ) {
    const employee = await this.getEmployeeForUser(userId, tenantId);

    // Check if clocked in
    const lastEvent = await this.getLastEventToday(employee.id, tenantId);
    if (!lastEvent || lastEvent.type === TimeEventType.CLOCK_OUT) {
      throw new BadRequestException(
        'You must clock in before you can clock out.',
      );
    }

    const timeEvent = this.timeEventRepository.create({
      employeeId: employee.id,
      type: TimeEventType.CLOCK_OUT,
      timestamp: new Date(),
      location: dto.location,
      ipAddress,
      deviceInfo: dto.deviceInfo,
      tenantId: tenantId,
      createdBy: userId,
      updatedBy: userId,
    });

    return await this.timeEventRepository.save(timeEvent);
  }

  /**
   * Returns the current attendance status for the authenticated user.
   */
  async getStatus(userId: number, tenantId: number) {
    const employee = await this.getEmployeeForUser(userId, tenantId);
    const lastEvent = await this.getLastEventToday(employee.id, tenantId);

    if (!lastEvent) {
      return { status: 'NOT_CLOCKED_IN', clockedInAt: null };
    }

    if (lastEvent.type === TimeEventType.CLOCK_IN) {
      return { status: 'CLOCKED_IN', clockedInAt: lastEvent.timestamp };
    }

    return {
      status: 'CLOCKED_OUT',
      clockedInAt: null,
      lastClockOutAt: lastEvent.timestamp,
    };
  }

  private async getEmployeeForUser(
    userId: number,
    tenantId: number,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { userId, tenantId, deletedAt: IsNull() },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user.');
    }
    return employee;
  }

  private async getLastEventToday(
    employeeId: number,
    tenantId: number,
  ): Promise<TimeEvent | null> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.timeEventRepository.findOne({
      where: {
        employeeId,
        tenantId,
      },
      order: { timestamp: 'DESC' },
    });
  }

  async getMyLogs(userId: number, tenantId: number): Promise<TimeEvent[]> {
    const employee = await this.getEmployeeForUser(userId, tenantId);

    return this.timeEventRepository.find({
      where: {
        employeeId: employee.id,
        tenantId,
      },
      order: { timestamp: 'DESC' },
      take: 50,
    });
  }
}
