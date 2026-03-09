import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateTimeEventDto } from './dto/create-time-event.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { TimeEvent } from '@/entities/hris/time-event.entity';

import { Request as ExpressRequest } from 'express';

// Ensure our custom properties exist on the Request interface
interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    tenantId: number;
  };
}

@ApiTags('Attendance')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @RequirePermissions('hris.attendance.log')
  @ApiOperation({ summary: 'Record a clock-in event for the current employee' })
  @ApiResponse({
    status: 201,
    description: 'Successfully clocked in.',
    type: TimeEvent,
  })
  async clockIn(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTimeEventDto,
  ) {
    const ipAddress = req.ip || '';
    return this.attendanceService.clockIn(
      req.user.id,
      req.user.tenantId,
      ipAddress,
      dto,
    );
  }

  @Post('clock-out')
  @RequirePermissions('hris.attendance.log')
  @ApiOperation({
    summary: 'Record a clock-out event for the current employee',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully clocked out.',
    type: TimeEvent,
  })
  async clockOut(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTimeEventDto,
  ) {
    const ipAddress = req.ip || '';
    return this.attendanceService.clockOut(
      req.user.id,
      req.user.tenantId,
      ipAddress,
      dto,
    );
  }

  @Get('status')
  @RequirePermissions('hris.attendance.log')
  @ApiOperation({ summary: 'Get current attendance status' })
  @ApiResponse({ status: 200, description: 'Current status details.' })
  async getStatus(@Req() req: AuthenticatedRequest) {
    return this.attendanceService.getStatus(req.user.id, req.user.tenantId);
  }
  @Get('logs')
  @RequirePermissions('hris.attendance.view')
  @ApiOperation({ summary: 'Get current attendance logs' })
  @ApiResponse({ status: 200, description: 'List of attendance logs.' })
  async getMyLogs(@Req() req: AuthenticatedRequest) {
    return this.attendanceService.getMyLogs(req.user.id, req.user.tenantId);
  }
}
