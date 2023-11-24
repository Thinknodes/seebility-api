import { Test, TestingModule } from '@nestjs/testing';
import {
  GeneratorService,
  PromptGenerator,
  TokenCounter,
} from './generator.service';
import {
  IGeneratorService,
  IPromptGenerator,
  ITokenCounter,
} from '@domain/adapters/ai.interface';
import { OPEN_API_PROVIDER, OpenAPIProvider } from './provider';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import OpenAI from 'openai';

describe('LLM Generator Services', () => {
  let generatorService: IGeneratorService;
  let promptGenerator: IPromptGenerator;
  let tokenCounter: ITokenCounter;
  let openai: DeepMockProxy<OpenAI>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeneratorService,
        PromptGenerator,
        OpenAPIProvider,
        TokenCounter,
      ],
    })
      .overrideProvider(OPEN_API_PROVIDER)
      .useValue(mockDeep<OpenAI>())
      .compile();
    generatorService = module.get<IGeneratorService>(GeneratorService);
    promptGenerator = module.get<IPromptGenerator>(PromptGenerator);
    tokenCounter = module.get<ITokenCounter>(TokenCounter);
    openai = module.get(OPEN_API_PROVIDER);
  });

  describe('Generator Service', () => {
    it('should be defined', () => {
      expect(generatorService).toBeDefined();
    });

    it('should generate new text', async () => {
      openai.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: 'test',
            },
          },
        ],
      } as any);
      const text = await generatorService.generateText('test');
      expect(openai.chat.completions.create).toHaveBeenCalled();
      expect(text).toBe('test');
    });
  });

  describe('Prompt Generator', () => {
    it('should be defined', () => {
      expect(promptGenerator).toBeDefined();
    });

    it('should generate prompt', async () => {
      const text = await promptGenerator.generateSpeechPrompt({
        title: 'test',
        topic: 'test',
        story: 'test',
        speaker: 'test',
        length: 1,
        lengthType: 'TIME',
      });
      expect(text.length).toBeGreaterThan(0);
    });
  });

  describe('Token Counter', () => {
    it('should be defined', () => {
      expect(tokenCounter).toBeDefined();
    });

    it('should count tokens', async () => {
      const text = await tokenCounter.countTokens('test');
      expect(text).toBeGreaterThan(0);
    });
  });
});
