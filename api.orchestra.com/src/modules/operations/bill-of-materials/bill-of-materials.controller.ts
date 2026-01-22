import { Controller } from '@nestjs/common';
import { BillOfMaterialsService } from './bill-of-materials.service';

@Controller('bill-of-materials')
export class BillOfMaterialsController {
  constructor(
    private readonly billOfMaterialsService: BillOfMaterialsService,
  ) {}
}
