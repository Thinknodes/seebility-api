import { Test, TestingModule } from '@nestjs/testing';
import { JwtTokenService } from './jwt.service';
import { TokenType } from '@domain/adapters/jwt.interface';
import { JwtModule } from '@nestjs/jwt';
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';

describe('BcryptService', () => {
  let service: JwtTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({}), ExceptionsModule],
      providers: [JwtTokenService],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign a payload correctly', async () => {
    const payload = { username: 'username', type: TokenType.ACCESS };
    const token = await service.signPayload(payload, 'secret', '1h');
    expect(token).toBeDefined();
  });

  it('should validate a token correctly', async () => {
    const payload = { username: 'username', type: TokenType.ACCESS };
    const token = await service.signPayload(payload, 'secret', '1h');
    const decoded = await service.validateToken(token, 'secret');
    expect(decoded).toBeDefined();
    expect(decoded.username).toBe('username');
    expect(decoded.type).toBe(TokenType.ACCESS);
  });
});
