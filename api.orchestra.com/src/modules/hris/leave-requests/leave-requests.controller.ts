import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeaveRequestsService } from './leave-requests.service';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestStatusDto,
} from './dto/leave-request.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { LeaveRequest } from '@/entities';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    tenantId: number;
  };
}

@ApiTags('Leave Requests')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris/leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @RequirePermissions('hris.leave.request')
  @ApiOperation({ summary: 'Submit a new leave request' })
  @ApiResponse({ status: 201, type: LeaveRequest })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateLeaveRequestDto) {
    return this.leaveRequestsService.create(
      dto,
      req.user.tenantId,
      req.user.id,
    );
  }

  @Get()
  @RequirePermissions('hris.leave.manage')
  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, type: [LeaveRequest] })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.leaveRequestsService.findAll(
      req.user.tenantId,
      employeeId ? +employeeId : undefined,
    );
  }

  @Get('my-requests')
  @RequirePermissions('hris.leave.request')
  @ApiOperation({ summary: 'Get current user leave requests' })
  @ApiResponse({ status: 200, type: [LeaveRequest] })
  async findMyRequests(@Req() req: AuthenticatedRequest) {
    return this.leaveRequestsService.findByUser(req.user.id, req.user.tenantId);
  }

  @Get(':id')
  @RequirePermissions('hris.leave.manage')
  @ApiOperation({ summary: 'Get a leave request by id' })
  @ApiResponse({ status: 200, type: LeaveRequest })
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leaveRequestsService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id/status')
  @RequirePermissions('hris.leave.manage')
  @ApiOperation({ summary: 'Approve or reject a leave request' })
  @ApiResponse({ status: 200, type: LeaveRequest })
  updateStatus(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateLeaveRequestStatusDto,
  ) {
    return this.leaveRequestsService.updateStatus(
      +id,
      dto,
      req.user.tenantId,
      req.user.id,
    );
  }
}
