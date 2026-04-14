import { PartialType } from '@nestjs/swagger';
import { CreateOperationsDashboardDto } from './create-operations-dashboard.dto';

export class UpdateOperationsDashboardDto extends PartialType(
  CreateOperationsDashboardDto,
) {}
