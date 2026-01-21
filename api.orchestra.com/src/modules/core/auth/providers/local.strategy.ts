import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'

/**
 * Passport strategy for local authentication using email and password.
 *
 * This strategy configures Passport to use email as the username field
 * and delegates user validation to the AuthService.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of LocalStrategy.
   * @param authService - Service handling user validation logic
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  /**
   * Validates user credentials for Passport authentication.
   *
   * This method is called by Passport during the authentication process.
   * It validates the provided email and password combination.
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns The authenticated Principal entity, or null if validation fails
   */
  async validate(email: string, password: string) {
    const principal = await this.authService.validateUser(email, password)
    if (!principal) return null
    return principal
  }
}
