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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LeaveTypesService } from './leave-types.service';
import { CreateLeaveTypeDto, UpdateLeaveTypeDto } from './dto/leave-type.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { LeaveType } from '@/entities/hris/leave-type.entity';
import { Request as ExpressRequest } from 'express';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    tenantId: number;
  };
}

@ApiTags('Leave Types')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris/leave-types')
export class LeaveTypesController {
  constructor(private readonly leaveTypesService: LeaveTypesService) {}

  @Post()
  @RequirePermissions('hris.leave_type.manage')
  @ApiOperation({ summary: 'Create a new leave type' })
  @ApiResponse({ status: 201, type: LeaveType })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateLeaveTypeDto) {
    return this.leaveTypesService.create(dto, req.user.tenantId, req.user.id);
  }

  @Get()
  @RequirePermissions('hris.leave_type.manage')
  @ApiOperation({ summary: 'Get all leave types' })
  @ApiResponse({ status: 200, type: [LeaveType] })
  findAll(@Req() req: AuthenticatedRequest) {
    return this.leaveTypesService.findAll(req.user.tenantId);
  }

  @Get(':id')
  @RequirePermissions('hris.leave_type.manage')
  @ApiOperation({ summary: 'Get a leave type by id' })
  @ApiResponse({ status: 200, type: LeaveType })
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leaveTypesService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @RequirePermissions('hris.leave_type.manage')
  @ApiOperation({ summary: 'Update a leave type' })
  @ApiResponse({ status: 200, type: LeaveType })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateLeaveTypeDto,
  ) {
    return this.leaveTypesService.update(
      +id,
      dto,
      req.user.tenantId,
      req.user.id,
    );
  }

  @Delete(':id')
  @RequirePermissions('hris.leave_type.manage')
  @ApiOperation({ summary: 'Delete a leave type' })
  @ApiResponse({ status: 200 })
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.leaveTypesService.remove(+id, req.user.tenantId);
  }
}
