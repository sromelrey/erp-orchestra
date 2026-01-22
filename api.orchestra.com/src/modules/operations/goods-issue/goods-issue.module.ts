import { Module } from '@nestjs/common';
import { GoodsIssueService } from './goods-issue.service';
import { GoodsIssueController } from './goods-issue.controller';

@Module({
  controllers: [GoodsIssueController],
  providers: [GoodsIssueService],
})
export class GoodsIssueModule {}
