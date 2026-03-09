import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequest } from '@/entities/hris/leave-request.entity';
import { Employee } from '@/entities/hris/employee.entity';
import { LeaveType } from '@/entities/hris/leave-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveRequest, Employee, LeaveType])],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
