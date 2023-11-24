import { ILogger } from '@domain/logger/logger.interface';
import { mock, MockProxy } from 'jest-mock-extended';
import { SpeechRepository } from '@domain/repositories/speechRepository.interface';
import { LengthType, SpeechM } from '@domain/model/speech';
import { CreateSpeechDTO, SpeechUseCases } from '../speech.usecases';
import {
  IGeneratorService,
  IPromptGenerator,
  ITokenCounter,
} from '@domain/adapters/ai.interface';

describe('uses_cases/SpeechUseCases', () => {
  let speechUseCases: SpeechUseCases;
  let speechRepo: MockProxy<SpeechRepository>;
  let logger: MockProxy<ILogger>;
  let generator: MockProxy<IGeneratorService>;
  let promptGenerator: MockProxy<IPromptGenerator>;
  let tokenCounter: MockProxy<ITokenCounter>;

  const speech = new SpeechM({
    title: 'title',
    topic: 'topic',
    story: 'story',
    speaker: 'speaker',
    length: 1,
    readingTime: 1,
    completedText: 'completedText',
    completionTime: 12,
    lengthType: 'TIME',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(() => {
    logger = mock<ILogger>();
    speechRepo = mock<SpeechRepository>();
    generator = mock<IGeneratorService>();
    promptGenerator = mock<IPromptGenerator>();
    tokenCounter = mock<ITokenCounter>();
    speechUseCases = new SpeechUseCases(
      logger as any,
      generator,
      promptGenerator,
      tokenCounter,
      speechRepo,
    );
  });

  it('should crete speech', async () => {
    const data: CreateSpeechDTO = {
      speaker: 'speaker',
      title: 'title',
      topic: 'topic',
      story: 'story',
      length: 1,
      lengthType: LengthType.TIME,
    };

    promptGenerator.generateSpeechPrompt.mockResolvedValue('prompt');
    generator.generateText.mockResolvedValue('text');
    tokenCounter.countTokens.mockResolvedValue(1);
    speechRepo.createSpeech.mockResolvedValue(speech);

    const response = await speechUseCases.createSpeech(data, '1');

    expect(response).toEqual(speech);
    expect(promptGenerator.generateSpeechPrompt).toBeCalledTimes(1);
    expect(promptGenerator.generateSpeechPrompt).toBeCalledWith(data);
    expect(generator.generateText).toBeCalledTimes(1);
    expect(generator.generateText).toBeCalledWith('prompt');
    expect(tokenCounter.countTokens).toBeCalledTimes(2);
    expect(tokenCounter.countTokens).toBeCalledWith('text');
    expect(tokenCounter.countTokens).toBeCalledWith('prompt');
    expect(speechRepo.createSpeech).toBeCalledTimes(1);
    expect(speechRepo.createSpeech).toBeCalledWith({
      ...data,
      completedText: 'text',
      completionTime: expect.any(Number),
      tokens: 2,
      userId: '1',
      readingTime: 1,
    });
  });
});
