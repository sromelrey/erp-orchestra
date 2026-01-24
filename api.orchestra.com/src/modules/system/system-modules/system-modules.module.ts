import { Module } from '@nestjs/common';
import { SystemModulesService } from './system-modules.service';
import { SystemModulesController } from './system-modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModule } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModule])],
  controllers: [SystemModulesController],
  providers: [SystemModulesService],
})
export class SystemModulesModule {}
