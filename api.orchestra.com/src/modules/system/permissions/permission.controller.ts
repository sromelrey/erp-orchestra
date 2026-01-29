import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { Roles } from '@/decorators/roles.decorator';
import { AuthenticatedGuard } from '@/guards/authenticated.guard';
import { RolesGuard } from '@/guards/roles.guard';

/**
 * Controller for managing Permission resources.
 *
 * Provides endpoints for listing permissions and checking user access.
 * Access is restricted to users with ADMIN role.
 */
@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(AuthenticatedGuard, RolesGuard)
@Roles('ADMIN')
@Controller('system/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /**
   * Retrieves all permissions grouped by module.
   *
   * @returns List of all permissions
   */
  @Get()
  @ApiOperation({ summary: 'List all permissions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all permissions grouped by module.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required.',
  })
  findAll() {
    return this.permissionService.findAll();
  }

  /**
   * Checks if the current user has a specific permission.
   *
   * @param checkPermissionDto - Contains the permission slug to check
   * @param req - Request object containing user info
   * @returns Object with hasPermission boolean
   */
  @Post('check')
  @ApiOperation({ summary: 'Check if current user has a permission' })
  @ApiBody({ type: CheckPermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Returns whether the user has the permission.',
    schema: {
      type: 'object',
      properties: {
        hasPermission: { type: 'boolean' },
      },
    },
  })
  async checkPermission(
    @Body() checkPermissionDto: CheckPermissionDto,
    @Request() req: { user: { id: number } },
  ) {
    const hasPermission = await this.permissionService.checkPermission(
      req.user.id,
      checkPermissionDto.permission,
    );
    return { hasPermission };
  }
}
