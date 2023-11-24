import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import {
  IJwtServicePayload,
  TokenType,
} from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { LoggerService } from '@infrastructure/logger/logger.service';

export class LoginUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsService,
    private readonly bcrypt: BcryptService,
  ) {}

  async authenticate(email: string, password: string) {
    const exists = await this.userRepository.getUserByEmail(email);

    if (!exists) {
      throw this.exception.badRequestException({
        message: 'User and password does not match',
      });
    }

    const isMatch = await this.bcrypt.compare(password, exists.password);
    if (!isMatch) {
      throw this.exception.badRequestException({
        message: 'User and password does not match',
      });
    }

    this.logger.log(`The user ${email} have been logged.`);
    const accessToken = await this.getAccessToken(email, exists.id);
    const refresh = await this.getRefreshToken(email, exists.id);
    return {
      ...accessToken,
      ...refresh,
    };
  }

  async getAccessToken(email: string, id: string) {
    const accessTokenPayload: IJwtServicePayload = {
      email,
      id,
      type: TokenType.ACCESS,
    };
    const access = await this.jwtTokenService.signPayload(
      accessTokenPayload,
      this.jwtConfig.getJwtSecret(),
      this.jwtConfig.getJwtExpirationTime(),
    );
    return {
      access,
      accessExpiresIn: this.jwtConfig.getJwtExpirationTime(),
    };
  }

  async getRefreshToken(email: string, id: string) {
    const refreshTokenPayload: IJwtServicePayload = {
      email,
      id,
      type: TokenType.REFRESH,
    };
    const refresh = await this.jwtTokenService.signPayload(
      refreshTokenPayload,
      this.jwtConfig.getJwtRefreshSecret(),
      this.jwtConfig.getJwtRefreshExpirationTime(),
    );
    return {
      refresh,
      refreshExpiresIn: this.jwtConfig.getJwtRefreshExpirationTime(),
    };
  }

  async validateAccessToken(access: string) {
    const payload = await this.jwtTokenService.validateToken(access);
    if (payload.type !== TokenType.ACCESS) {
      throw this.exception.badRequestException({
        message: 'Invalid token',
      });
    }
    return payload;
  }

  async validateRefreshToken(refresh: string) {
    const payload = await this.jwtTokenService.validateToken(
      refresh,
      this.jwtConfig.getJwtRefreshSecret(),
    );
    if (payload.type !== TokenType.REFRESH) {
      throw this.exception.badRequestException({
        message: 'Invalid token',
      });
    }
    return payload;
  }

  async updateLoginTime(email: string) {
    await this.userRepository.updateLastLogin(email);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }
}
