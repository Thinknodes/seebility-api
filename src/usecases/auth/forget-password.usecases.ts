import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { EmailService } from '@infrastructure/services/email/emailer.service';
import { JWTConfig } from '@domain/config/jwt.interface';
import { TokenType } from '@domain/adapters/jwt.interface';
import { EnvironmentConfig } from '@domain/config/environment.interface';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';

export class ForgetPasswordUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsService,
    private readonly config: JWTConfig & EnvironmentConfig,
    private readonly mail: EmailService,
    private readonly bcrypt: BcryptService,
  ) {}

  async initiateResetPassword(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return;
    }
    const token = await this.jwtTokenService.signPayload(
      {
        email,
        id: user.id,
        type: TokenType.RESET,
      },
      this.config.getResetPasswordSecret(),
      this.config.getResetPasswordExpirationTime(),
    );
    await this.mail.sendResetLink(email, {
      name: user.name,
      link: `${this.config.getResetPasswordUrl()}/${token}`,
    });
  }

  async validateResetPasswordToken(token: string) {
    const payload = await this.jwtTokenService.validateToken(
      token,
      this.config.getResetPasswordSecret(),
    );
    if (payload.type !== TokenType.RESET) {
      throw this.exception.badRequestException({
        message: 'Invalid token',
      });
    }
    const user = await this.userRepository.getUserByEmail(payload.email);
    if (!user) {
      throw this.exception.badRequestException({
        message: 'User not found',
      });
    }
    return user;
  }

  async resetPassword(token: string, password: string) {
    const user = await this.validateResetPasswordToken(token);
    const hashed = await this.bcrypt.hash(password);
    await this.userRepository.updatePassword(user.id, hashed);
  }
}
