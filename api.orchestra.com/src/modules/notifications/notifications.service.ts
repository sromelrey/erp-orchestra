import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  /**
   * Send in-app notification for successful timesheet generation
   */
  sendSuccessNotification(
    tenantId: number,
    title: string,
    message: string,
  ): void {
    // TODO: Implement in-app notification system
    console.log(`[${tenantId}] SUCCESS: ${title} - ${message}`);
  }

  /**
   * Send in-app notification for processing errors
   */
  sendErrorNotification(
    tenantId: number,
    title: string,
    message: string,
  ): void {
    // TODO: Implement in-app notification system
    console.error(`[${tenantId}] ERROR: ${title} - ${message}`);
  }
}
