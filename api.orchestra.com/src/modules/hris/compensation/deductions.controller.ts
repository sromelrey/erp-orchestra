import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
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
import { CreateDeductionDto, UpdateDeductionDto } from './dto/deduction.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { PermissionsGuard } from '@/guards/permissions.guard';

/**
 * Controller for managing employee deduction records.
 *
 * Provides CRUD endpoints for deduction management.
 * Access is controlled via slug-based permissions (hris.compensation.view / hris.compensation.manage).
 */
@ApiTags('HRIS Deductions')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, PermissionsGuard)
@Controller('hris/employees/:employeeId/deductions')
export class DeductionsController {
  constructor(private readonly compensationService: CompensationService) {}

  @Get()
  @RequirePermissions('hris.compensation.view')
  @ApiOperation({ summary: 'Get employee deductions' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Employee deductions retrieved successfully.',
  })
  async getEmployeeDeductions(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.compensationService.findEmployeeDeductions(employeeId);
  }

  @Post()
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Create employee deduction' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiBody({ type: CreateDeductionDto })
  @ApiResponse({
    status: 201,
    description: 'Deduction created successfully.',
  })
  async createDeduction(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() dto: CreateDeductionDto,
  ) {
    const { effectiveDate, endDate, ...rest } = dto;
    const deductionData = {
      ...rest,
      effectiveDate: new Date(effectiveDate),
      ...(endDate && { endDate: new Date(endDate) }),
    };
    return this.compensationService.createDeduction(employeeId, deductionData);
  }

  @Put(':id')
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Update employee deduction' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDeductionDto })
  @ApiResponse({
    status: 200,
    description: 'Deduction updated successfully.',
  })
  async updateDeduction(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDeductionDto,
  ) {
    const { effectiveDate, endDate, ...rest } = dto;
    const updates = {
      ...rest,
      ...(effectiveDate && { effectiveDate: new Date(effectiveDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
    };
    return this.compensationService.updateDeduction(id, employeeId, updates);
  }

  @Delete(':id')
  @RequirePermissions('hris.compensation.manage')
  @ApiOperation({ summary: 'Delete employee deduction' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Deduction deleted successfully.',
  })
  async deleteDeduction(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.compensationService.removeDeduction(id, employeeId);
  }

  @Get('calculate/:date')
  @RequirePermissions('hris.compensation.view')
  @ApiOperation({ summary: 'Calculate total deductions for a specific date' })
  @ApiParam({ name: 'employeeId', type: Number })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({
    status: 200,
    description: 'Deductions calculated successfully.',
  })
  async calculateDeductions(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Param('date') date: string,
  ) {
    const calculationDate = new Date(date);
    const totalDeductions =
      await this.compensationService.calculateTotalDeductions(
        employeeId,
        calculationDate,
      );
    return { totalDeductions };
  }
}
