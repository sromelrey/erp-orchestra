import { Request } from 'express';
import { User } from '@/entities';

export interface AuthenticatedRequest extends Request {
  user: User;
  principal?: User;
}
