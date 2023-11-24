import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { Request } from 'express';

@Injectable()
export default class JwtRefreshGuard implements CanActivate {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromHeader(request) ??
      this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.loginUsecaseProxy
        .getInstance()
        .validateRefreshToken(token);
      // We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.refresh as string;
    return token;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies.refresh;
  }
}
