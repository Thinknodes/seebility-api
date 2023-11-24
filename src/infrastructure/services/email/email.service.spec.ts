import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create message', async () => {
    const message = await service.createMessage('register', {
      name: 'test',
      otp: 'test',
    });
    expect(message).toBeDefined();
    expect(message.length).toBeGreaterThan(1);
  });
});
