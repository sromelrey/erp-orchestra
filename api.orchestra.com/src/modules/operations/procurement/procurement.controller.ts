import { Controller } from '@nestjs/common';
import { ProcurementService } from './procurement.service';

@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}
}
