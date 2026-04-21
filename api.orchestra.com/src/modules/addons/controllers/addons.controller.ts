import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { AddonsService } from '../services/addons.service';
import { AddonPricingService } from '../services/addon-pricing.service';
import { CreateAddonDto } from '../dto/create-addon.dto';
import { UpdateAddonDto } from '../dto/update-addon.dto';
import { CreateAddonRuleDto } from '../dto/create-addon-rule.dto';
import { UpdateAddonRuleDto } from '../dto/update-addon-rule.dto';
import { CalculateAddonPriceDto } from '../dto/addon-selection.dto';

@ApiTags('Add-ons')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('addons')
export class AddonsController {
  constructor(
    private readonly addonsService: AddonsService,
    private readonly addonPricingService: AddonPricingService,
  ) {}

  // Add-on Management
  @Get()
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.view' })
  @ApiOperation({ summary: 'List all add-ons' })
  @ApiResponse({ status: 200, description: 'Add-ons retrieved successfully' })
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.addonsService.findAll(
      {
        tenantId: req.user.tenantId!,
        userId: req.user.id,
      },
      {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search,
        type: type as 'PHYSICAL' | 'SERVICE' | undefined,
        isActive: isActive ? isActive === 'true' : undefined,
      },
    );
  }

  @Get(':id')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.view' })
  @ApiOperation({ summary: 'Get add-on by ID' })
  @ApiResponse({ status: 200, description: 'Add-on retrieved successfully' })
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.addonsService.findOne(parseInt(id), {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Post()
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.create' })
  @ApiOperation({ summary: 'Create new add-on' })
  @ApiResponse({ status: 201, description: 'Add-on created successfully' })
  async create(
    @Body() createDto: CreateAddonDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonsService.create(createDto, {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Patch(':id')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.update' })
  @ApiOperation({ summary: 'Update add-on' })
  @ApiResponse({ status: 200, description: 'Add-on updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAddonDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonsService.update(parseInt(id), updateDto, {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.delete' })
  @ApiOperation({ summary: 'Delete add-on' })
  @ApiResponse({ status: 200, description: 'Add-on deleted successfully' })
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.addonsService.remove(parseInt(id), {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  // Inclusion Rules Management
  @Get('rules/list')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.rules.view' })
  @ApiOperation({ summary: 'List all inclusion rules' })
  @ApiResponse({ status: 200, description: 'Rules retrieved successfully' })
  async findAllRules(@Request() req: AuthenticatedRequest) {
    return this.addonsService.findAllRules({
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Post('rules')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.rules.manage' })
  @ApiOperation({ summary: 'Create new inclusion rule' })
  @ApiResponse({ status: 201, description: 'Rule created successfully' })
  async createRule(
    @Body() createDto: CreateAddonRuleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonsService.createRule(createDto, {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Patch('rules/:id')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.rules.manage' })
  @ApiOperation({ summary: 'Update inclusion rule' })
  @ApiResponse({ status: 200, description: 'Rule updated successfully' })
  async updateRule(
    @Param('id') id: string,
    @Body() updateDto: UpdateAddonRuleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonsService.updateRule(parseInt(id), updateDto, {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Delete('rules/:id')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.rules.manage' })
  @ApiOperation({ summary: 'Delete inclusion rule' })
  @ApiResponse({ status: 200, description: 'Rule deleted successfully' })
  async removeRule(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonsService.removeRule(parseInt(id), {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  // Pricing Calculator
  @Post('calculate-price')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.view' })
  @ApiOperation({ summary: 'Calculate add-on pricing' })
  @ApiResponse({ status: 200, description: 'Price calculated successfully' })
  async calculatePrice(
    @Body() calculateDto: CalculateAddonPriceDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonPricingService.calculatePrice(calculateDto, {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Get(':id/rules')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.view' })
  @ApiOperation({ summary: 'Get add-on with its rules' })
  @ApiResponse({
    status: 200,
    description: 'Add-on with rules retrieved successfully',
  })
  async getAddonWithRules(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonPricingService.getAddonWithRules(parseInt(id), {
      tenantId: req.user.tenantId!,
      userId: req.user.id,
    });
  }

  @Get(':id/check-eligibility')
  @RequireAccess({ feature: 'ADDONS', permission: 'addons.view' })
  @ApiOperation({ summary: 'Check inclusion eligibility for add-on' })
  @ApiResponse({ status: 200, description: 'Eligibility checked successfully' })
  async checkEligibility(
    @Param('id') id: string,
    @Query('quantity') quantity: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.addonPricingService.checkInclusionEligibility(
      parseInt(id),
      parseInt(quantity),
      {
        tenantId: req.user.tenantId!,
        userId: req.user.id,
      },
    );
  }
}
