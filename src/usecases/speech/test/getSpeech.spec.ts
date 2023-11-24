import { ILogger } from '@domain/logger/logger.interface';
import { mock, MockProxy } from 'jest-mock-extended';
import { GetSpeechUseCases } from '../getSpeech.usecases';
import { SpeechRepository } from '@domain/repositories/speechRepository.interface';
import { SpeechM } from '@domain/model/speech';

describe('uses_cases/GetSpeechUseCases', () => {
  let getSpeechUseCases: GetSpeechUseCases;
  let speechRepo: MockProxy<SpeechRepository>;
  let logger: MockProxy<ILogger>;

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
    getSpeechUseCases = new GetSpeechUseCases(logger as any, speechRepo);
  });

  it('should get speech', async () => {
    speechRepo.getSpeechById.mockResolvedValue(speech);

    const response = await getSpeechUseCases.getSpeech('1');
    expect(response).toEqual(speech);
    expect(speechRepo.getSpeechById).toBeCalledTimes(1);
    expect(speechRepo.getSpeechById).toBeCalledWith('1');
  });

  it('should get speeches', async () => {
    speechRepo.getSpeechesByUserId.mockResolvedValue([speech]);

    const response = await getSpeechUseCases.getSpeechesByUserId('1');
    expect(response).toEqual([speech]);
    expect(speechRepo.getSpeechesByUserId).toBeCalledTimes(1);
    expect(speechRepo.getSpeechesByUserId).toBeCalledWith('1');
  });
});
