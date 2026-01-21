import { TypeormStore } from 'connect-typeorm';
import { Repository } from 'typeorm';
import { Session } from '@/entities/session.entity';

/**
 * Creates session configuration object for Express session middleware.
 *
 * This function generates a complete session configuration object compatible
 * with express-session middleware, using TypeORM as the session store.
 * The configuration includes security settings, cookie options, and database
 * persistence through the TypeormStore.
 *
 * @param options - Configuration options for session setup
 * @param options.cookieSecret - Secret key used to sign session cookies
 * @param options.secure - Whether to use secure cookies (HTTPS only)
 * @param options.sessionRepository - TypeORM repository for Session entity
 * @returns Session configuration object for express-session middleware
 */
export function getSessionConfig({
  cookieSecret,
  secure,
  sessionRepository,
}: {
  cookieSecret: string;
  secure: boolean;
  sessionRepository: Repository<Session>;
}) {
  return {
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
      secure,
      httpOnly: true,
    },
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: true,
    }).connect(sessionRepository),
  };
}
