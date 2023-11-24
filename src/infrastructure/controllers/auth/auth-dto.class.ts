import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Length,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

export class GoogleSignInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly idToken: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class ResendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  readonly otp: string;
}

export class ForgetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class ValidateForgetPasswordTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class ChangeEmailDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
    require_tld: true,
  })
  readonly image: string;
}
