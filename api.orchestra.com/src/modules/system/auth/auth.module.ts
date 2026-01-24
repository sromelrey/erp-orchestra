import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { User } from '@/entities';
import { AuthService } from './providers/auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './providers/local.strategy';
import { LocalSerializer } from './providers/local.serializer';

/**
 * Authentication module providing login, logout, and session management.
 *
 * This module configures Passport.js with local strategy for username/password
 * authentication, provides authentication services, and exports the AuthService
 * for use by other modules.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'local', session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, LocalSerializer],
  exports: [AuthService],
})
export class AuthModule {}
