import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class GenerateTimesheetsDto {
  @ApiProperty({ example: 1, description: 'Internal ID of the Pay Period' })
  @IsNumber()
  @IsNotEmpty()
  payPeriodId: number;
}
