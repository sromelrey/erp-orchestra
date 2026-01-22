import { Module } from '@nestjs/common';
import { MaterialMasterService } from './material-master.service';
import { MaterialMasterController } from './material-master.controller';

@Module({
  controllers: [MaterialMasterController],
  providers: [MaterialMasterService],
})
export class MaterialMasterModule {}
