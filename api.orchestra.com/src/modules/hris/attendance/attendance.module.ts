import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TimeEvent } from '@/entities/hris/time-event.entity';
import { Employee } from '@/entities/hris/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeEvent, Employee])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
