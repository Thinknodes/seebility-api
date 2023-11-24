import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../../domain/adapters/jwt.interface';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly exceptions: ExceptionsService,
  ) {}

  async validateToken<T extends object = IJwtServicePayload>(
    token: string,
    secret?: string,
  ) {
    try {
      const decode = await this.jwtService.verifyAsync<T>(token, {
        secret,
      });
      return decode;
    } catch (error) {
      throw this.exceptions.unauthorizedException({
        message: 'Invalid token',
      });
    }
  }

  async signPayload(
    payload: IJwtServicePayload,
    secret?: string,
    expiresIn?: string,
  ) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
