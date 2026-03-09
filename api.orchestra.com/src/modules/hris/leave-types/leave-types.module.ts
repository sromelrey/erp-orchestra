import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaveTypesService } from './leave-types.service';
import { LeaveTypesController } from './leave-types.controller';
import { LeaveType } from '@/entities/hris/leave-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LeaveType])],
  controllers: [LeaveTypesController],
  providers: [LeaveTypesService],
})
export class LeaveTypesModule {}
