import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RequirePermissions } from '@/decorators/require-permissions.decorator';
import { CompensationService } from './compensation.service';
import {
  CreateCompensationDto,
  UpdateCompensationDto,
} from './dto/compensation.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';
import { AuthenticatedRequest } from '@/types/authenticated-request';

/**
 * Controller for managing employee compensation records.
 *
 * Provides CRUD endpoints for compensation management.
 * Access is controlled via slug-based permissions (hris.compensation.view / hris.compensation.manage).
 */
@ApiTags('HRIS Compensation')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/employees/:employeeId/compensation')
export class CompensationController {
  constructor(private readonly compensationService: CompensationService) {}

  @Get()
  @RequirePermissions('hris.compensation.view')
  @ApiOperation({ summary: 'Get employee compensation records' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Employee compensation records retrieved successfully.',
  })
  async getEmployeeCompensation(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.compensationService.findEmployeeCompensation(employeeId);
  }

  @Post()
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Create employee compensation record' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiBody({ type: CreateCompensationDto })
  @ApiResponse({
    status: 201,
    description: 'Compensation record created successfully.',
  })
  async createCompensation(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() dto: CreateCompensationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { effectiveDate, endDate, ...rest } = dto;
    const compensationData = {
      ...rest,
      effectiveDate: new Date(effectiveDate),
      ...(endDate && { endDate: new Date(endDate) }),
    };
    return this.compensationService.createCompensation(
      employeeId,
      compensationData,
      req.user?.id,
      dto.changeReason,
    );
  }

  @Put(':id')
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Update employee compensation record' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCompensationDto })
  @ApiResponse({
    status: 200,
    description: 'Compensation record updated successfully.',
  })
  async updateCompensation(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCompensationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { effectiveDate, endDate, ...rest } = dto;
    const updates = {
      ...rest,
      ...(effectiveDate && { effectiveDate: new Date(effectiveDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };
    return this.compensationService.updateCompensation(
      id,
      employeeId,
      updates,
      req.user?.id,
      dto.changeReason,
    );
  }

  @Delete(':id')
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Delete employee compensation record' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Compensation record deleted successfully.',
  })
  async deleteCompensation(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.compensationService.removeCompensation(
      id,
      employeeId,
      req.user?.id,
      'Deleted via API',
    );
  }

  @Get('calculate/:date')
  @RequirePermissions('hris.compensation.view')
  @ApiOperation({ summary: 'Calculate total compensation for a specific date' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({
    status: 200,
    description: 'Compensation calculated successfully.',
  })
  async calculateCompensation(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('date') date: string,
  ) {
    const calculationDate = new Date(date);
    return this.compensationService.calculateTotalCompensation(
      employeeId,
      calculationDate,
    );
  }

  @Get('history')
  @RequirePermissions('hris.compensation.view')
  @ApiOperation({ summary: 'Get compensation change history' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Compensation history retrieved successfully.',
  })
  async getCompensationHistory(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.compensationService.getCompensationHistory(employeeId);
  }
}
