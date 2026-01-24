import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModule, Plan } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, SystemModule])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
