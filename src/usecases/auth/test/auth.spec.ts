import { IBcryptService } from '@domain/adapters/bcrypt.interface';
import { IJwtService, TokenType } from '@domain/adapters/jwt.interface';
import { JWTConfig } from '@domain/config/jwt.interface';
import { IException } from '@domain/exceptions/exceptions.interface';
import { ILogger } from '@domain/logger/logger.interface';
import { ModeOfSignUp, UserM } from '@domain/model/user';
import { UserRepository } from '@domain/repositories/userRepository.interface';
import { LoginUseCases } from '../login.usecases';
import { mock } from 'jest-mock-extended';

describe('uses_cases/authentication', () => {
  let loginUseCases: LoginUseCases;
  let logger: ILogger;
  let exception: IException;
  let jwtService: IJwtService;
  let jwtConfig: JWTConfig;
  let userRepo: UserRepository;
  let bcryptService: IBcryptService;

  beforeEach(() => {
    logger = mock<ILogger>();
    exception = mock<IException>();
    jwtService = mock<IJwtService>();
    jwtConfig = mock<JWTConfig>();
    userRepo = mock<UserRepository>();
    bcryptService = mock<IBcryptService>();

    loginUseCases = new LoginUseCases(
      logger as any,
      jwtService as any,
      jwtConfig,
      userRepo,
      exception as any,
      bcryptService,
    );
  });

  describe('creating access token', () => {
    it('should create an access token', async () => {
      const expireIn = '200';
      const token = 'token';
      const secret = 'secret';
      (jwtConfig.getJwtSecret as jest.Mock).mockReturnValue(secret);
      (jwtConfig.getJwtExpirationTime as jest.Mock).mockReturnValue(expireIn);
      (jwtService.signPayload as jest.Mock).mockResolvedValue(token);

      const response = await loginUseCases.getAccessToken(
        'test@gmail.com',
        '1',
      );
      expect(jwtService.signPayload).toBeCalledTimes(1);
      expect(jwtService.signPayload).toBeCalledWith(
        {
          email: 'test@gmail.com',
          id: '1',
          type: TokenType.ACCESS,
        },
        secret,
        expireIn,
      );
      expect(response).toEqual({
        access: token,
        accessExpiresIn: expireIn,
      });
    });
    it('should not validate access token', async () => {
      const payload = {
        email: 'test@gmail.com',
        id: '1',
        type: TokenType.REFRESH,
      };
      const token = 'token';
      (jwtService.validateToken as jest.Mock).mockResolvedValue(payload);
      (exception.badRequestException as jest.Mock).mockReturnValue(
        new Error('Invalid token'),
      );

      expect(
        async () => await loginUseCases.validateAccessToken(token),
      ).rejects.toThrow('Invalid token');
      expect(jwtService.validateToken).toBeCalledTimes(1);
      expect(jwtService.validateToken).toBeCalledWith(token);
    });
  });

  describe('Authenticate user', () => {
    it('should be non existing user', async () => {
      (userRepo.getUserByEmail as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );
      (exception.badRequestException as jest.Mock).mockReturnValue(
        new Error('User not found'),
      );

      expect(
        async () => await loginUseCases.authenticate('test@gmail.com', 'test'),
      ).rejects.toThrow('User not found');
    });

    it('should be incorrect password', async () => {
      const user: UserM = {
        id: '1',
        name: 'test',
        email: 'test@gmail.com',
        password: 'password',
        lastLogin: null,
        isEmailVerified: true,
        modeOfSignUp: ModeOfSignUp.EMAIL,
      };
      (userRepo.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (exception.badRequestException as jest.Mock).mockReturnValue(
        new Error('Password is incorrect'),
      );
      (bcryptService.compare as jest.Mock).mockResolvedValue(false);

      expect(
        async () => await loginUseCases.authenticate('test@gmail.com', 'test'),
      ).rejects.toThrow('Password is incorrect');
    });

    it('should authenticate user', async () => {
      const user: UserM = {
        id: '1',
        name: 'test',
        email: 'test@gmail.com',
        password: 'password',
        lastLogin: null,
        isEmailVerified: true,
        modeOfSignUp: ModeOfSignUp.EMAIL,
      };
      (userRepo.getUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcryptService.compare as jest.Mock).mockResolvedValue(true);

      const expireIn = '200';
      const accessToken = 'token';
      const refreshToken = 'refresh token';
      (jwtConfig.getJwtSecret as jest.Mock).mockReturnValue('secret');
      (jwtConfig.getJwtExpirationTime as jest.Mock).mockReturnValue(expireIn);
      (jwtConfig.getJwtRefreshSecret as jest.Mock).mockReturnValue('secret');
      (jwtConfig.getJwtRefreshExpirationTime as jest.Mock).mockReturnValue(
        expireIn,
      );
      (jwtService.signPayload as jest.Mock)
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const response = await loginUseCases.authenticate(
        'test@gmail.com',
        'test',
      );
      expect(jwtConfig.getJwtExpirationTime).toBeCalledTimes(2);
      expect(jwtConfig.getJwtSecret).toBeCalledTimes(1);
      expect(jwtConfig.getJwtRefreshExpirationTime).toBeCalledTimes(2);
      expect(jwtConfig.getJwtRefreshSecret).toBeCalledTimes(1);
      expect(jwtService.signPayload).toHaveBeenCalledWith(
        {
          email: 'test@gmail.com',
          id: '1',
          type: TokenType.ACCESS,
        },
        'secret',
        expireIn,
      );
      expect(jwtService.signPayload).toHaveBeenCalledWith(
        {
          email: 'test@gmail.com',
          id: '1',
          type: TokenType.REFRESH,
        },
        'secret',
        expireIn,
      );
      expect(jwtService.signPayload).toBeCalledTimes(2);
      expect(response).toEqual({
        access: accessToken,
        accessExpiresIn: expireIn,
        refresh: refreshToken,
        refreshExpiresIn: expireIn,
      });
    });
  });
});
