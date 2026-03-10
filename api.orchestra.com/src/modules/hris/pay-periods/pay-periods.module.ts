import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriod } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PayPeriod])],
  controllers: [PayPeriodsController],
  providers: [PayPeriodsService],
  exports: [PayPeriodsService],
})
export class PayPeriodsModule {}
