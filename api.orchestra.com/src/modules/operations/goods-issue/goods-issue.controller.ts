import { Controller } from '@nestjs/common';
import { GoodsIssueService } from './goods-issue.service';

@Controller('goods-issue')
export class GoodsIssueController {
  constructor(private readonly goodsIssueService: GoodsIssueService) {}
}
