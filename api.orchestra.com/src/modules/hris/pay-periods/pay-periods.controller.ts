import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PayPeriodsService } from './pay-periods.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod } from '@/entities';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    tenantId: number;
  };
}

@ApiTags('Pay Periods')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris/pay-periods')
export class PayPeriodsController {
  constructor(private readonly payPeriodsService: PayPeriodsService) {}

  @Post()
  @RequireAccess({ feature: 'HRIS', permission: 'hris.payroll.manage' })
  @ApiOperation({ summary: 'Create a new pay period' })
  @ApiResponse({
    status: 201,
    description: 'Pay period created successfully.',
    type: PayPeriod,
  })
  @ApiBody({ type: CreatePayPeriodDto })
  create(
    @Body() createPayPeriodDto: CreatePayPeriodDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.payPeriodsService.create(createPayPeriodDto, req.user.tenantId);
  }

  @Get()
  @RequireAccess({ feature: 'HRIS', permission: 'hris.payroll.view' })
  @ApiOperation({ summary: 'Retrieve all pay periods' })
  @ApiResponse({
    status: 200,
    description: 'List of pay periods.',
    type: [PayPeriod],
  })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.payPeriodsService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.payroll.view' })
  @ApiOperation({ summary: 'Get details of a pay period' })
  @ApiResponse({
    status: 200,
    description: 'Pay period details.',
    type: PayPeriod,
  })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.payPeriodsService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.payroll.manage' })
  @ApiOperation({ summary: 'Update a pay period' })
  @ApiResponse({
    status: 200,
    description: 'Pay period updated successfully.',
    type: PayPeriod,
  })
  @ApiBody({ type: UpdatePayPeriodDto })
  update(
    @Param('id') id: string,
    @Body() updatePayPeriodDto: UpdatePayPeriodDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.payPeriodsService.update(
      +id,
      updatePayPeriodDto,
      req.user.tenantId,
    );
  }

  @Delete(':id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.payroll.manage' })
  @ApiOperation({ summary: 'Delete a pay period' })
  @ApiResponse({ status: 204, description: 'Pay period deleted successfully.' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.payPeriodsService.remove(+id, req.user.tenantId);
  }
}
