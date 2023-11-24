/* eslint-disable @typescript-eslint/no-namespace */
import { IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { timeStringToSeconds } from '@infrastructure/common/utils/timer';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtServicePayload;
    }
  }
}

/**
 * This middleware checks if the user is authenticated with a valid token.
 */
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private logger = new LoggerService(AuthenticationMiddleware.name);

  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly exceptions: ExceptionsService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      return next();
    }

    try {
      const payload = await this.loginUsecaseProxy
        .getInstance()
        .validateAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Unauthorized';
      const status = error.status || 401;
      throw this.exceptions.unauthorizedException({
        message,
        code_error: status,
      });
    }
  }
}

@Injectable()
export class AuthenticationCookieMiddleware implements NestMiddleware {
  private logger = new LoggerService(AuthenticationCookieMiddleware.name);

  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly exceptions: ExceptionsService,
    private readonly config: EnvironmentConfigService,
  ) {}

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies?.token;
    return token;
  }

  private extractRefreshFromCookie(request: Request): string | undefined {
    const token = request.cookies?.refresh;
    return token;
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromCookie(req);
    this.logger.debug(token);
    if (token === undefined) {
      const refresh = this.extractRefreshFromCookie(req);
      this.logger.debug(refresh);
      try {
        if (refresh !== undefined) {
          const payload = await this.loginUsecaseProxy
            .getInstance()
            .validateRefreshToken(token);
          const access = await this.loginUsecaseProxy
            .getInstance()
            .getAccessToken(payload.email, payload.id);
          res.cookie('token', access.access, {
            httpOnly: true,
            path: '/',
            maxAge: timeStringToSeconds(access.accessExpiresIn) * 1000,
            sameSite: this.config.isDevelopment() ? 'lax' : 'none',
            secure: !this.config.isDevelopment(),
          });
          this.logger.debug(payload);
          req.user = payload;
        }
      } catch (e) {
        this.logger.error(e);
        const message = e.message || 'Unauthorized';
        const status = e.status || 401;
        throw this.exceptions.unauthorizedException({
          message,
          code_error: status,
        });
      }
      next();
      return;
    }

    try {
      const payload = await this.loginUsecaseProxy
        .getInstance()
        .validateAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Unauthorized';
      const status = error.status || 401;
      throw this.exceptions.unauthorizedException({
        message,
        code_error: status,
      });
    }
  }
}
