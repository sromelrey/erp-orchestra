import { Controller } from '@nestjs/common';
import { MaterialMasterService } from './material-master.service';

@Controller('material-master')
export class MaterialMasterController {
  constructor(private readonly materialMasterService: MaterialMasterService) {}
}
