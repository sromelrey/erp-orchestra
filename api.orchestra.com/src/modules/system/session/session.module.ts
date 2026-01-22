import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionService } from './session.service';
import { Session } from '@/entities/system/session.entity';
import { User } from '@/entities/system/user.entity';
import { UserRole } from '@/entities/system/user_role.entity';
import { SessionController } from './session.controller';

/**
 * Module for managing user sessions in the application.
 *
 * This module provides services for tracking active sessions, validating
 * session data, and associating sessions with users and their
 * roles.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Session, User, UserRole])],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
