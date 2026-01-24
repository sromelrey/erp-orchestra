import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { getSessionConfig } from './getSessionConfig';
import { ConfigService } from '@nestjs/config';
import { SessionModule } from '@/modules/system/sessions/session.module';
import { SessionService } from '@/modules/system/sessions/session.service';
import { setupSwagger } from './setupSwagger';
import { Env } from '@/types/';
import { Request, Response, NextFunction } from 'express';

/**
 * Request with session and user information
 */
interface AuthenticatedRequest extends Request {
  principal?: Express.User;
}

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
export function applyMiddlewares(app: INestApplication) {
  const configService = app.get(ConfigService);
  const sessionRepository = app
    .select(SessionModule)
    .get(SessionService).repository;
  const cookieSecret = configService.getOrThrow<string>('SESSION_SECRET');
  const nodeEnv = configService.getOrThrow<string>('NODE_ENV');
  const isProduction = nodeEnv === (Env.Prod as string);
  const secure = isProduction;

  // Configure helmet with development-friendly settings
  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginEmbedderPolicy: isProduction ? undefined : false,
      crossOriginOpenerPolicy: isProduction ? undefined : false,
      crossOriginResourcePolicy: isProduction ? undefined : false,
      originAgentCluster: false,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      strictTransportSecurity: isProduction
        ? { maxAge: 15552000, includeSubDomains: true }
        : false,
      xssFilter: false,
    }),
  );
  app.use(
    session(getSessionConfig({ cookieSecret, secure, sessionRepository })),
  );
  app.use((req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    console.log(
      '[Middleware] Session requested:',
      req.session ? 'PRESENT' : 'MISSING',
    );
    next();
  });
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (req.user && !req.principal) {
      req.principal = req.user;
    }
    next();
  });
  // Configure CORS to allow all origins (disable CSRF for development)
  app.enableCors({
    origin: true, // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Allow cookies, Authorization headers, etc.
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  setupSwagger(app);
}
