import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
  Res,
  Get,
  HttpStatus,
  HttpCode,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  AuthLoginDto,
  ChangeEmailDto,
  ChangePasswordDto,
  ForgetPasswordDto,
  GoogleSignInDto,
  RegisterDto,
  ResendOtpDto,
  ResetPasswordDto,
  UpdateProfileDto,
  ValidateForgetPasswordTokenDto,
  VerifyOtpDto,
} from './auth-dto.class';
import {
  IsAuthPresenter,
  MessagePresenter,
  RefreshedAccessTokenPresenter,
  UserPresenter,
} from './auth.presenter';

import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';
import { RegisterUseCases } from '@usecases/auth/register.usecases';
import { ForgetPasswordUseCases } from '@usecases/auth/forget-password.usecases';
import { CurrentUser } from '@infrastructure/common/decorators/currentUser';
import { IJwtLoginPayload } from '@domain/adapters/jwt.interface';
import { Response } from 'express';
import { timeStringToSeconds } from '@infrastructure/common/utils/timer';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ProfileUseCases } from '@usecases/auth/profile.usecases';

@Controller('auth')
@ApiTags('Authentication')
@ApiHeaders()
@ApiExtraModels(
  IsAuthPresenter,
  RefreshedAccessTokenPresenter,
  MessagePresenter,
)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: UseCaseProxy<RegisterUseCases>,
    @Inject(UsecasesProxyModule.FORGOT_PASSWORD_USECASES_PROXY)
    private readonly forgetPasswordUseCaseProxy: UseCaseProxy<ForgetPasswordUseCases>,
    @Inject(UsecasesProxyModule.PROFILE_USECASES_PROXY)
    private readonly profileUseCaseProxy: UseCaseProxy<ProfileUseCases>,
    private readonly config: EnvironmentConfigService,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({
    summary: 'Logging in a user',
    description: 'Use this route to log in a user',
  })
  @ApiOkResponse({
    description: 'The user was logged in successfully',
    type: IsAuthPresenter,
  })
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() auth: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.loginUseCaseProxy
      .getInstance()
      .authenticate(auth.email, auth.password);

    res.cookie('token', token.access, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(token.accessExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });
    res.cookie('refresh', token.refresh, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(token.refreshExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });
    return new IsAuthPresenter({
      token,
      email: auth.email,
    });
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logging out a user',
    description: 'Use this route to log out a user',
  })
  @ApiNoContentResponse({
    description: 'The user was logged out successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('refresh');
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refreshes the access token',
    description: 'Pass the refresh token in the Authorization header',
  })
  @ApiOkResponse({
    description: 'The access token was refreshed successfully',
    type: RefreshedAccessTokenPresenter,
  })
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: IJwtLoginPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const obj = await this.loginUseCaseProxy
      .getInstance()
      .getUserByEmail(user.email);
    if (!obj) {
      res.clearCookie('token');
      res.clearCookie('refresh');
      res.status(HttpStatus.UNAUTHORIZED);
      return new MessagePresenter({
        message: 'User not found',
        status: 'error',
      });
    }
    const access = await this.loginUseCaseProxy
      .getInstance()
      .getAccessToken(user.email, user.id);
    res.cookie('token', access.access, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(access.accessExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });
    return new RefreshedAccessTokenPresenter(access);
  }

  @Post('sign-in/google')
  @ApiBody({ type: GoogleSignInDto })
  @ApiOperation({
    summary: 'Signing in a user with google',
    description: 'Use this route to login a user with google',
  })
  @ApiOkResponse({
    description: 'The user was registered successfully and logged in',
    type: IsAuthPresenter,
  })
  @HttpCode(HttpStatus.OK)
  async signInWithGoogle(
    @Body() data: GoogleSignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.registerUseCaseProxy
      .getInstance()
      .registerWithGoogle(data.idToken);

    res.cookie('token', tokens.access, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(tokens.accessExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });
    res.cookie('refresh', tokens.refresh, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(tokens.refreshExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });

    return new IsAuthPresenter({
      token: tokens,
      email: tokens.email,
    });
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiOperation({
    summary: 'Registering a user',
    description: 'Use this route to register a user',
  })
  @ApiOkResponse({
    description: 'The user was registered successfully',
    type: MessagePresenter,
  })
  async register(@Body() data: RegisterDto) {
    await this.registerUseCaseProxy
      .getInstance()
      .register(data.email, data.password, data.name);
    this.registerUseCaseProxy.getInstance().sendRegisterOtp(data.email);
    return new MessagePresenter({
      message: 'User registered successfully',
      status: 'success',
    });
  }

  @Post('resend-otp')
  @ApiBody({ type: ResendOtpDto })
  @ApiOperation({
    summary: 'Resending OTP',
    description: 'Use this route to resend OTP',
  })
  @ApiOkResponse({
    description: 'The OTP was sent successfully',
    type: MessagePresenter,
  })
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() data: ResendOtpDto) {
    this.registerUseCaseProxy.getInstance().sendRegisterOtp(data.email);
    return new MessagePresenter({
      message: 'OTP sent successfully',
      status: 'success',
    });
  }

  @Post('verify-otp')
  @ApiBody({ type: VerifyOtpDto })
  @ApiOperation({
    summary: 'Verifying OTP',
    description: 'Use this route to verify OTP',
  })
  @ApiOkResponse({
    description: 'The OTP was verified successfully',
    type: MessagePresenter,
  })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() data: VerifyOtpDto) {
    await this.registerUseCaseProxy
      .getInstance()
      .verifyOtp(data.email, data.otp);
    return new MessagePresenter({
      message: 'OTP verified successfully',
      status: 'success',
    });
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgetPasswordDto })
  @ApiOperation({
    summary: 'Initiating password reset',
    description: 'Use this route to make a password reset request',
  })
  @ApiOkResponse({
    description: 'The password reset request was sent to the user successfully',
    type: MessagePresenter,
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgetPasswordDto) {
    await this.forgetPasswordUseCaseProxy
      .getInstance()
      .initiateResetPassword(body.email);
    return new MessagePresenter({
      message: 'Password reset request sent successfully',
      status: 'success',
    });
  }

  @Post('forgot-password/verify')
  @ApiBody({ type: ValidateForgetPasswordTokenDto })
  @ApiOperation({
    summary: 'Verifying password reset token',
    description: 'Use this route to verify password reset token',
  })
  @ApiOkResponse({
    description: 'The password reset token was verified successfully',
    type: MessagePresenter,
  })
  @HttpCode(HttpStatus.OK)
  async validateForgetPasswordToken(
    @Body() body: ValidateForgetPasswordTokenDto,
  ) {
    await this.forgetPasswordUseCaseProxy
      .getInstance()
      .validateResetPasswordToken(body.token);
    return new MessagePresenter({
      message: 'Password reset token verified successfully',
      status: 'success',
    });
  }

  @Post('forgot-password/reset')
  @ApiBody({ type: ResetPasswordDto })
  @ApiOperation({
    summary: 'Resetting password',
    description: 'Use this route to reset password',
  })
  @ApiOkResponse({
    description: 'User password was reset successfully',
    type: MessagePresenter,
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.forgetPasswordUseCaseProxy
      .getInstance()
      .resetPassword(body.token, body.password);
    return new MessagePresenter({
      message: 'Password reset successfully',
      status: 'success',
    });
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get user details',
    description: 'Use this route to get user details',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User details retrieved successfully',
    type: UserPresenter,
  })
  async getUser(
    @CurrentUser() user: IJwtLoginPayload,
    @Res({ passthrough: true }) re: Response,
  ) {
    const obj = await this.loginUseCaseProxy
      .getInstance()
      .getUserByEmail(user.email);
    if (!obj) {
      re.clearCookie('token');
      re.clearCookie('refresh');
      re.status(HttpStatus.UNAUTHORIZED);
      return new MessagePresenter({
        message: 'User not found',
        status: 'error',
      });
    }
    return new UserPresenter(obj);
  }

  @Post('profile')
  @ApiOperation({
    summary: 'Update user details',
    description: 'Use this route to update user details',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User details updated successfully',
    type: UserPresenter,
  })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @CurrentUser() user: IJwtLoginPayload,
    @Body() body: UpdateProfileDto,
  ) {
    const obj = await this.profileUseCaseProxy
      .getInstance()
      .updateProfile(body, user.id);
    return new UserPresenter(obj);
  }

  @Post('change-email')
  @ApiOperation({
    summary: 'Change user email',
    description: 'Use this route to change user email',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User email changed successfully',
    type: UserPresenter,
  })
  @ApiBody({ type: ChangeEmailDto })
  async changeEmail(
    @CurrentUser() user: IJwtLoginPayload,
    @Body() body: ChangeEmailDto,
    @Res({ passthrough: true }) r: Response,
  ) {
    const obj = await this.profileUseCaseProxy
      .getInstance()
      .updateEmail(user.id, body.email);
    r.clearCookie('token');
    r.clearCookie('refresh');
    const accessToken = await this.loginUseCaseProxy
      .getInstance()
      .getAccessToken(body.email, user.id);
    const refreshToken = await this.loginUseCaseProxy
      .getInstance()
      .getRefreshToken(body.email, user.id);

    r.cookie('token', accessToken.access, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(accessToken.accessExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });
    r.cookie('refresh', refreshToken.refresh, {
      httpOnly: true,
      path: '/',
      maxAge: timeStringToSeconds(refreshToken.refreshExpiresIn) * 1000,
      sameSite: this.config.isDevelopment() ? 'lax' : 'none',
      secure: !this.config.isDevelopment(),
    });

    return new UserPresenter(obj);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Change user password',
    description: 'Use this route to change user password',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User password was reset successfully',
    type: MessagePresenter,
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @CurrentUser() user: IJwtLoginPayload,
    @Body() body: ChangePasswordDto,
  ) {
    await this.profileUseCaseProxy
      .getInstance()
      .updatePassword(user.id, body.password);
    return new MessagePresenter({
      message: 'Password changed successfully',
      status: 'success',
    });
  }

  @Delete('delete-account')
  @ApiOperation({
    summary: 'Delete user account',
    description: 'Use this route to delete user account',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({
    description: 'User account was deleted successfully',
    type: MessagePresenter,
  })
  async deleteAccount(
    @CurrentUser() user: IJwtLoginPayload,
    @Res({ passthrough: true }) r: Response,
  ) {
    await this.profileUseCaseProxy.getInstance().deleteAccount(user.id);
    r.clearCookie('token');
    r.clearCookie('refresh');
    return new MessagePresenter({
      message: 'Account deleted successfully',
      status: 'success',
    });
  }
}
