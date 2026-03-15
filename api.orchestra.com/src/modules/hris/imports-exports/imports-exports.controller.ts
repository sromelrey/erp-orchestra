import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ImportsExportsService } from './imports-exports.service';
import { CreateImportDto } from './dto/create-import.dto';
import { CreateExportDto } from './dto/create-export.dto';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';

@ApiTags('HRIS Imports/Exports')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('hris')
export class ImportsExportsController {
  constructor(private readonly service: ImportsExportsService) {}

  @Post('imports')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.import.manage' })
  @ApiOperation({ summary: 'Request a new import job (returns job record)' })
  @ApiResponse({ status: 201, description: 'Import job created' })
  async requestImport(
    @Body() dto: CreateImportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new BadRequestException('Missing authenticated user context');
    }
    const actor = { id: req.user.id, tenantId: req.user.tenantId };
    return this.service.requestImport(dto, actor);
  }

  @Get('imports/:id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.import.manage' })
  @ApiOperation({ summary: 'Fetch import job status' })
  @ApiParam({ name: 'id', type: Number })
  async getImportJob(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user?.tenantId) {
      throw new BadRequestException('Missing tenant context');
    }
    return this.service.findImportJob(id, req.user.tenantId);
  }

  @Post('exports')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.export.manage' })
  @ApiOperation({ summary: 'Request a new export job (returns job record)' })
  @ApiResponse({ status: 201, description: 'Export job created' })
  async requestExport(
    @Body() dto: CreateExportDto,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new BadRequestException('Missing authenticated user context');
    }
    const actor = { id: req.user.id, tenantId: req.user.tenantId };
    return this.service.requestExport(dto, actor);
  }

  @Get('exports/:id')
  @RequireAccess({ feature: 'HRIS', permission: 'hris.export.manage' })
  @ApiOperation({ summary: 'Fetch export job status' })
  @ApiParam({ name: 'id', type: Number })
  async getExportJob(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    if (!req.user?.tenantId) {
      throw new BadRequestException('Missing tenant context');
    }
    return this.service.findExportJob(id, req.user.tenantId);
  }
}
