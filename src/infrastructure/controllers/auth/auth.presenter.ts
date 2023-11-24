import { UserM } from '@domain/model/user';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class AuthTokenPresenter {
  @ApiResponseProperty()
  access: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  accessExpiresIn: string;

  @ApiResponseProperty()
  refresh: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  refreshExpiresIn: string;

  constructor(data: Partial<AuthTokenPresenter>) {
    Object.assign(this, data);
  }
}

export class IsAuthPresenter {
  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty({
    type: AuthTokenPresenter,
  })
  token: AuthTokenPresenter;

  constructor(data: Partial<IsAuthPresenter>) {
    Object.assign(this, data);
  }
}

export class MessagePresenter {
  @ApiResponseProperty()
  message: string;

  @ApiProperty({
    description: 'The status of the request',
    example: 'success',
  })
  status: string;

  constructor(data: Partial<MessagePresenter>) {
    Object.assign(this, data);
  }
}

export class RefreshedAccessTokenPresenter {
  @ApiResponseProperty()
  access: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  accessExpiresIn: string;

  constructor(data: Partial<RefreshedAccessTokenPresenter>) {
    Object.assign(this, data);
  }
}

export class UserPresenter implements UserM {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  image: string;

  @ApiResponseProperty({
    type: Date,
  })
  lastLogin: Date;

  @ApiResponseProperty({
    type: Boolean,
  })
  isEmailVerified: boolean;

  @ApiResponseProperty()
  modeOfSignUp: string;

  @Exclude()
  password: string;

  constructor(data: Partial<UserPresenter>) {
    Object.assign(this, data);
  }
}
