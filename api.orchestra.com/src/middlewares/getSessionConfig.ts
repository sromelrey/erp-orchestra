import { SessionOptions } from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { Repository } from 'typeorm';
import { Session } from '@/entities/system/session.entity';

export function getSessionConfig({
  cookieSecret,
  secure,
  sessionRepository,
}: {
  cookieSecret: string;
  secure: boolean;
  sessionRepository: Repository<Session>;
}): SessionOptions {
  const sessionConfig: SessionOptions = {
    secret: cookieSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
      secure,
      httpOnly: true,
      sameSite: secure ? 'none' : 'lax',
    },
    proxy: true,
    store: new TypeormStore({
      cleanupLimit: 2,
      limitSubquery: true,
    }).connect(sessionRepository),
  };

  return sessionConfig;
}
