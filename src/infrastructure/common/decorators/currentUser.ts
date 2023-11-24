import { IJwtLoginPayload } from '@domain/adapters/jwt.interface';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as unknown as Request;

    const payload = request.user as IJwtLoginPayload;
    if (payload) {
      return payload;
    }

    throw new UnauthorizedException(
      'You must be logged in to access this resource',
    );
  },
);
