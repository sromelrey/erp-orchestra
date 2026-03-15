import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportJob, ExportJob } from '@/entities';
import { ImportsExportsController } from './imports-exports.controller';
import { ImportsExportsService } from './imports-exports.service';

@Module({
  imports: [TypeOrmModule.forFeature([ImportJob, ExportJob])],
  controllers: [ImportsExportsController],
  providers: [ImportsExportsService],
  exports: [ImportsExportsService],
})
export class ImportsExportsModule {}
