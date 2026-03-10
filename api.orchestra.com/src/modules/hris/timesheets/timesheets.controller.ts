import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TimesheetsService } from './timesheets.service';
import { GenerateTimesheetsDto } from './dto/generate-timesheets.dto';
import { UpdateTimesheetStatusDto } from './dto/update-timesheet-status.dto';
import { Timesheet } from '@/entities';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    tenantId: number;
  };
}

@ApiTags('Timesheets')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris/timesheets')
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Post('generate')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.timesheet.manage' })
  @ApiOperation({
    summary: 'Batch generate or refresh timesheets for a pay period',
  })
  @ApiResponse({
    status: 201,
    description: 'Timesheets generated successfully.',
  })
  @ApiBody({ type: GenerateTimesheetsDto })
  generate(
    @Body() generateDto: GenerateTimesheetsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetsService.generate(generateDto, req.user.tenantId);
  }

  @Get()
  @RequireAccess({ feature: 'HRIS', permission: 'hris.timesheet.view' })
  @ApiOperation({ summary: 'Retrieve all timesheets for a period' })
  @ApiQuery({ name: 'payPeriodId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of timesheets.',
    type: [Timesheet],
  })
  findAll(
    @Query('payPeriodId') payPeriodId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetsService.findAll(+payPeriodId, req.user.tenantId);
  }

  @Get('summary')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.timesheet.view' })
  @ApiOperation({ summary: 'Get aggregation summary for a pay period' })
  @ApiQuery({ name: 'payPeriodId', required: true, type: Number })
  getSummary(
    @Query('payPeriodId') payPeriodId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetsService.getSummary(+payPeriodId, req.user.tenantId);
  }

  @Get(':id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.timesheet.view' })
  @ApiOperation({ summary: 'Get detailed timesheet with daily logs' })
  @ApiResponse({
    status: 200,
    description: 'Timesheet details.',
    type: Timesheet,
  })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.timesheetsService.findOne(id, req.user.tenantId);
  }

  @Patch(':id/status')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.timesheet.manage' })
  @ApiOperation({ summary: 'Update timesheet status (Approve/Reject)' })
  @ApiResponse({
    status: 200,
    description: 'Status updated successfully.',
    type: Timesheet,
  })
  @ApiBody({ type: UpdateTimesheetStatusDto })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateTimesheetStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.timesheetsService.updateStatus(
      id,
      updateDto,
      req.user.tenantId,
    );
  }
}
