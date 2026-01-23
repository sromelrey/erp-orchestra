import { Controller } from '@nestjs/common';
import { AccountsPayableService } from './accounts-payable.service';

@Controller('accounts-payable')
export class AccountsPayableController {
  constructor(
    private readonly accountsPayableService: AccountsPayableService,
  ) {}
}
