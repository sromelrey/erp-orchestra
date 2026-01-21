import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { getSessionConfig } from './getSessionConfig';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from '@/modules/core/session/session.module';
import { SessionService } from '@/modules/core/session/session.service';
import { setupSwagger } from './setupSwagger';
import { Env } from '@/types/';

/**
 * Applies all necessary middlewares to the NestJS application.
 *
 * This function configures the complete middleware stack for the application including:
 * - Security headers (Helmet)
 * - Session management with TypeORM store
 * - Passport authentication
 * - CORS configuration for frontend access
 * - Swagger documentation
 * - Principal mapping from user to request object
 *
 * @param app - The NestJS application instance to configure with middlewares
 */
export function applyMiddlewares(app: INestApplication<any>) {
  const configService = app.get(ConfigService);
  const sessionRepository = app
    .select(SessionModule)
    .get(SessionService).repository;
  const cookieSecret = configService.getOrThrow<string>('SESSION_SECRET');
  const secure = configService.getOrThrow<string>('NODE_ENV') === Env.Prod;
  app.use(helmet());
  app.use(
    session(getSessionConfig({ cookieSecret, secure, sessionRepository })),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req: any, _res, next) => {
    if (req.user && !req.principal) {
      req.principal = req.user;
    }
    next();
  });
  // ✅ ENABLE CORS FOR FRONTEND TO ACCESS COOKIES
  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'), // Your Next.js frontend
    credentials: true, // Allow cookies, Authorization headers, etc.
  });
  setupSwagger(app);
}
