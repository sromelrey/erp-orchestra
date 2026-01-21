import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService { async hasPermission(userId: number, menuIdOrCode: number | string, action: string): Promise<boolean> { return true; } }
