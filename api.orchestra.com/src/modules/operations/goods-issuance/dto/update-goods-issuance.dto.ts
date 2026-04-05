import { PartialType } from '@nestjs/swagger';
import { CreateGoodsIssuanceDto } from './create-goods-issuance.dto';

export class UpdateGoodsIssuanceDto extends PartialType(
  CreateGoodsIssuanceDto,
) {}
