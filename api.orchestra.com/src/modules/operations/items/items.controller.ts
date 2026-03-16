import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RequireAccess } from '@/decorators/require-access.decorator';
import { AuthenticatedRequest } from '@/types/authenticated-request';
import { ItemsService } from './items.service';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@ApiTags('Operations - Items')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard)
@Controller('ops')
export class ItemsController {
  constructor(private readonly service: ItemsService) {}

  // Categories
  @Post('categories')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.category.manage',
  })
  @ApiOperation({ summary: 'Create item category' })
  @ApiResponse({ status: 201 })
  async createCategory(
    @Body() dto: CreateItemCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.createCategory(dto, actor);
  }

  @Get('categories')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.category.manage',
  })
  @ApiOperation({ summary: 'List item categories' })
  async listCategories(@Req() req: AuthenticatedRequest) {
    const actor = this.requireActor(req);
    return this.service.findCategories(actor.tenantId);
  }

  @Patch('categories/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.category.manage',
  })
  @ApiOperation({ summary: 'Update item category' })
  @ApiParam({ name: 'id', type: Number })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.updateCategory(id, dto, actor.tenantId, actor.userId);
  }

  // Units of measure
  @Post('uoms')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.uom.manage',
  })
  @ApiOperation({ summary: 'Create unit of measure' })
  async createUom(
    @Body() dto: CreateUnitOfMeasureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.createUom(dto, actor);
  }

  @Get('uoms')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.uom.manage',
  })
  @ApiOperation({ summary: 'List units of measure' })
  async listUoms(@Req() req: AuthenticatedRequest) {
    const actor = this.requireActor(req);
    return this.service.findUoms(actor.tenantId);
  }

  @Patch('uoms/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.uom.manage',
  })
  @ApiOperation({ summary: 'Update unit of measure' })
  @ApiParam({ name: 'id', type: Number })
  async updateUom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnitOfMeasureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.updateUom(id, dto, actor.tenantId, actor.userId);
  }

  // Items
  @Post('items')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiOperation({ summary: 'Create item' })
  async createItem(
    @Body() dto: CreateItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.createItem(dto, actor);
  }

  @Get('items')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.view',
  })
  @ApiOperation({ summary: 'List items' })
  async listItems(@Req() req: AuthenticatedRequest) {
    const actor = this.requireActor(req);
    return this.service.findItems(actor.tenantId);
  }

  @Patch('items/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiOperation({ summary: 'Update item' })
  @ApiParam({ name: 'id', type: Number })
  async updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.requireActor(req);
    return this.service.updateItem(id, dto, actor);
  }

  private requireActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new BadRequestException('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }
}
