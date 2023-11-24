import { LoggerService } from '@infrastructure/logger/logger.service';
import { SpeechRepository } from '@domain/repositories/speechRepository.interface';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';

export class GetSpeechUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly speechRepository: SpeechRepository,
    private readonly exception: ExceptionsService,
  ) {}

  async getSpeech(id: string) {
    const speech = await this.speechRepository.getSpeechById(id);
    if (!speech) {
      throw this.exception.notFoundException({
        message: 'Speech not found',
      });
    }
    return speech;
  }

  async getSpeechesByUserId(userId: string) {
    const speeches = await this.speechRepository.getSpeechesByUserId(userId);
    return speeches;
  }
}
