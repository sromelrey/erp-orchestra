import {
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

  private getActor(req: AuthenticatedRequest) {
    if (!req.user?.id || !req.user?.tenantId) {
      throw new Error('Missing authenticated user context');
    }
    return { userId: req.user.id, tenantId: req.user.tenantId };
  }

  // Categories
  @Post('item-categories')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiOperation({ summary: 'Create item category' })
  createCategory(
    @Body() dto: CreateItemCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.createCategory(dto, actor);
  }

  @Get('item-categories')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.view',
  })
  @ApiOperation({ summary: 'List item categories' })
  listCategories(@Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findCategories(actor.tenantId);
  }

  @Patch('item-categories/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateCategory(id, dto, actor);
  }

  // UOMs
  @Post('item-uoms')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiOperation({ summary: 'Create unit of measure' })
  createUom(
    @Body() dto: CreateUnitOfMeasureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.createUom(dto, actor);
  }

  @Get('item-uoms')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.view',
  })
  @ApiOperation({ summary: 'List units of measure' })
  listUoms(@Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findUoms(actor.tenantId);
  }

  @Patch('item-uoms/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  updateUom(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnitOfMeasureDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateUom(id, dto, actor);
  }

  // Items
  @Post('items')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiOperation({ summary: 'Create item' })
  createItem(@Body() dto: CreateItemDto, @Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.createItem(dto, actor);
  }

  @Get('items')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.view',
  })
  @ApiOperation({ summary: 'List items' })
  listItems(@Req() req: AuthenticatedRequest) {
    const actor = this.getActor(req);
    return this.service.findItems(actor.tenantId);
  }

  @Patch('items/:id')
  @RequireAccess({
    feature: 'OPERATIONS',
    permission: 'operations.item.manage',
  })
  @ApiParam({ name: 'id', type: Number })
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateItemDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const actor = this.getActor(req);
    return this.service.updateItem(id, dto, actor);
  }
}
