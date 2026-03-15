import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { TriggerPayrollRunDto } from './dto/trigger-payroll-run.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { Payslip } from '@/entities';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { RunResult } from './payroll.service';

@ApiTags('HRIS - Payroll')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('payslips')
  @RequirePermissions('hris.payroll.view')
  @ApiOperation({ summary: 'List payslips (optionally filter by pay period)' })
  @ApiQuery({ name: 'payPeriodId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of payslips.' })
  listPayslips(
    @Query('payPeriodId') payPeriodId: string | undefined,
    @Req() req: AuthenticatedRequest,
  ): Promise<Payslip[]> {
    const payPeriodFilter = payPeriodId ? Number(payPeriodId) : undefined;
    return this.payrollService.list(payPeriodFilter, req.user.tenantId!);
  }

  @Get('payslips/:id')
  @RequirePermissions('hris.payroll.view')
  @ApiOperation({ summary: 'Get a payslip' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the payslip.' })
  @ApiResponse({ status: 404, description: 'Payslip not found.' })
  getPayslip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Payslip> {
    return this.payrollService.get(id, req.user.tenantId!);
  }

  @Post('run')
  @RequirePermissions('hris.payroll.manage')
  @ApiOperation({ summary: 'Trigger payroll run for a pay period' })
  @ApiBody({ type: TriggerPayrollRunDto })
  @ApiResponse({ status: 200, description: 'Payroll run triggered.' })
  triggerRun(
    @Body() dto: TriggerPayrollRunDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<RunResult> {
    return this.payrollService.runPayroll(dto, req.user.tenantId!);
  }

  @Post('payslips/:id/publish')
  @RequirePermissions('hris.payroll.manage')
  @ApiOperation({ summary: 'Publish a payslip' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Payslip published.' })
  publishPayslip(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<Payslip> {
    return this.payrollService.publish(id, req.user.tenantId!);
  }
}
