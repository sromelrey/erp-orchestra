import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { User } from '../../../entities/system/user.entity';
import { PaginatedResult } from '@/types';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';
import { Roles } from '@/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * List users for a specific tenant.
   * Restricted to SUPER_ADMIN or tenant admins (future).
   */
  @Get('tenant/:tenantId')
  @Roles('SUPER_ADMIN' /* , 'ADMIN' future */)
  @ApiOperation({ summary: 'List users for a specific tenant' })
  @ApiResponse({ status: 200, description: 'Return paginated users.' })
  async findAllForTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Query() paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userService.findAllForTenant(tenantId, paginationDto);
  }

  /**
   * Create a user for a specific tenant.
   */
  @Post('tenant/:tenantId')
  @Roles('SUPER_ADMIN' /* , 'ADMIN' future */)
  @ApiOperation({ summary: 'Create a user for a specific tenant' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiBody({ type: CreateTenantUserDto })
  async createForTenant(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body() createDto: CreateTenantUserDto,
  ): Promise<User> {
    return this.userService.createForTenant(tenantId, createDto);
  }
}
