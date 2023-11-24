import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { EmailService } from '@infrastructure/services/email/emailer.service';
import {
  Environment,
  EnvironmentConfig,
} from '@domain/config/environment.interface';
import { ILogger } from '@domain/logger/logger.interface';
import { IException } from '@domain/exceptions/exceptions.interface';
import { IBcryptService } from '@domain/adapters/bcrypt.interface';
import { ICacheService } from '@domain/adapters/cache.interface';
import { IFirebaseService } from '@domain/adapters/firebase.interface';
import { JWTConfig } from '@domain/config/jwt.interface';
import { JwtTokenService } from '@infrastructure/services/jwt/jwt.service';
import { TokenType } from '@domain/adapters/jwt.interface';

export class RegisterUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: UserRepository,
    private readonly exception: IException,
    private readonly bcrypt: IBcryptService,
    private readonly mail: EmailService,
    private readonly cache: ICacheService,
    private readonly config: EnvironmentConfig & JWTConfig,
    private readonly firebaseService: IFirebaseService,
    private readonly jwtService: JwtTokenService,
  ) {}

  async register(email: string, password: string, name: string) {
    const exists = await this.userRepository.getUserByEmail(email);

    if (exists) {
      throw this.exception.badRequestException({
        message: 'Email already exists',
      });
    }

    const hashedPassword = await this.bcrypt.hash(password);

    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    this.logger.log(`The user ${email} have been created.`);
    return user;
  }

  async registerWithGoogle(idToken: string) {
    const response = await this.firebaseService.verifyIdToken(idToken);

    if (response == null) {
      this.logger.error('Invalid token');
      throw this.exception.unauthorizedException();
    }

    const { email, email_verified, picture, name } = response;

    if (!email_verified) {
      this.logger.error('===> UNVERIFIED GOOGLE ACCOUNT <===');
      throw this.exception.badRequestException({
        message: 'Unverified google account',
      });
    }

    let user = await this.userRepository.getUserByEmail(email);
    if (user != null) {
      if (!user.isEmailVerified) {
        await this.userRepository.updateProfile(
          {
            isEmailVerified: true,
          },
          user.id,
        );
      }
    } else {
      user = await this.userRepository.createOauthUser({
        email,
        name,
        image: picture,
        isEmailVerified: true,
      });
    }

    const payload = {
      email,
      id: user.id,
    };
    const access = await this.jwtService.signPayload(
      {
        ...payload,
        type: TokenType.ACCESS,
      },
      this.config.getJwtSecret(),
      this.config.getJwtExpirationTime(),
    );
    const refresh = await this.jwtService.signPayload(
      {
        ...payload,
        type: TokenType.REFRESH,
      },
      this.config.getJwtRefreshSecret(),
      this.config.getJwtRefreshExpirationTime(),
    );
    return {
      access,
      refresh,
      accessExpiresIn: this.config.getJwtExpirationTime(),
      refreshExpiresIn: this.config.getJwtRefreshExpirationTime(),
      email: user.email,
    };
  }

  async createOtp(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.cache.set(`otp-${email}`, otp, 60 * 5);
    this.logger.log(`The OTP ${otp} have been created.`);
    return otp;
  }

  async sendRegisterOtp(email: string) {
    const otp = (await this.createOtp(email)).toString();
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw this.exception.badRequestException({
        message: 'Email does not exist',
      });
    }
    if (user.isEmailVerified) {
      throw this.exception.badRequestException({
        message: 'Email already verified',
      });
    }
    this.mail.sendRegisterOtp(email, {
      name: user.name,
      otp,
    });
    this.logger.log(`The OTP ${otp} have been sent to ${email}.`);
  }

  async verifyOtp(email: string, otp: string) {
    const savedOtp = await this.cache.get(`otp-${email}`);
    const env = this.config.getEnvironment();
    console.log(savedOtp);
    if (env === Environment.Development && otp === '123456') {
      return;
    }
    if (savedOtp?.toString() !== otp) {
      throw this.exception.badRequestException({
        message: 'Invalid OTP',
      });
    }
    await this.cache.del(`otp-${email}`);
  }
}
