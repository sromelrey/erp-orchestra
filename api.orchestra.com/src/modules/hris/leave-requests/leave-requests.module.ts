import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveRequestsService } from './leave-requests.service';
import { LeaveRequestsController } from './leave-requests.controller';
import { LeaveRequest, Employee, LeaveType, TimeEvent } from '@/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeaveRequest, Employee, LeaveType, TimeEvent]),
  ],
  controllers: [LeaveRequestsController],
  providers: [LeaveRequestsService],
})
export class LeaveRequestsModule {}
