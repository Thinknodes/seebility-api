import { LoggerService } from '@infrastructure/logger/logger.service';
import { LengthType } from '@domain/model/speech';
import { SpeechRepository } from '@domain/repositories/speechRepository.interface';
import {
  IGeneratorService,
  IPromptGenerator,
  ITokenCounter,
} from '@domain/adapters/ai.interface';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { Observable, TeardownLogic } from 'rxjs';
import { ChatCompletionChunk } from 'openai/resources';

export interface CreateSpeechDTO {
  speaker: string;
  title: string;
  topic: string;
  story: string;
  length: number;
  lengthType: LengthType;
}

export interface UpdateSpeechDTO {
  speechId: string;
  completedText: string;
}

export class SpeechUseCases {
  constructor(
    private readonly logger: LoggerService,
    private readonly generator: IGeneratorService,
    private readonly promptGenerator: IPromptGenerator,
    private readonly tokenCounter: ITokenCounter,
    private readonly speechRepository: SpeechRepository,
    private readonly exception: ExceptionsService,
  ) {}

  async createSpeech(data: CreateSpeechDTO, userId: string) {
    const speech = await this.speechRepository.createSpeech({
      ...data,
      completionTime: 0,
      userId,
      completedText: '',
      tokens: 0,
      readingTime: 0,
    });
    return speech;
  }

  async streamSpeech(speechId: string, userId: string) {
    const speech = await this.speechRepository.getSpeechById(speechId);
    if (!speech) {
      throw this.exception.notFoundException({ message: 'Speech not found' });
    }
    if (speech.userId !== userId) {
      throw this.exception.unauthorizedException({
        message: 'Speech does not belong to user',
      });
    }
    const prompt = await this.promptGenerator.generateSpeechPrompt(speech);
    const promptTokens = await this.tokenCounter.countTokens(prompt);
    const stream = await this.generator.streamText(prompt);
    let accumulated = '';
    const now = new Date();
    const observable = new Observable<{
      data: string;
    }>((observer) => {
      (async () => {
        try {
          this.logger.debug('Starting stream');
          for await (const chunk of stream) {
            if (chunk.choices[0].finish_reason === 'stop') {
              this.logger.debug('Stream finished');
              // Update speech
              await this.speechRepository.updateSpeech(
                {
                  completedText: accumulated,
                  completionTime: new Date().getTime() - now.getTime(),
                  tokens:
                    promptTokens +
                    (await this.tokenCounter.countTokens(accumulated)),
                },
                speech.id,
              );
              observer.complete();
            } else {
              accumulated += chunk.choices[0].delta.content;
              observer.next({ data: chunk.choices[0].delta.content });
            }
          }
        } catch (error) {
          this.logger.error(error);
          observer.error(error);
        }
      })();

      return () => {
        this.logger.debug('Stream ended');
      };
    });

    return observable;
  }

  async generateSpeech(data: CreateSpeechDTO, userId: string) {
    const prompt = await this.promptGenerator.generateSpeechPrompt(data);
    const now = new Date();
    const text = await this.generator.generateText(prompt);
    const tokens =
      (await this.tokenCounter.countTokens(text)) +
      (await this.tokenCounter.countTokens(prompt));

    const wordsPerMinute = 200; // Average case.
    const numberOfWords = text.split(' ').length;
    const readingTime = Math.ceil(numberOfWords / wordsPerMinute);

    const speech = await this.speechRepository.createSpeech({
      ...data,
      completedText: text,
      completionTime: new Date().getTime() - now.getTime(),
      tokens,
      userId,
      readingTime,
    });
    return speech;
  }

  async updateSpeech(data: UpdateSpeechDTO) {
    const speech = await this.speechRepository.getSpeechById(data.speechId);
    const tokens = await this.tokenCounter.countTokens(data.completedText);

    const wordsPerMinute = 200; // Average case.
    const numberOfWords = data.completedText.split(' ').length;
    const readingTime = Math.ceil(numberOfWords / wordsPerMinute);

    return this.speechRepository.updateSpeech(
      {
        completedText: data.completedText,
        tokens: speech.tokens + tokens,
        readingTime,
      },
      speech.id,
    );
  }

  async deleteSpeech(speechId: string, userId: string) {
    const speech = await this.speechRepository.getSpeechById(speechId);
    if (!speech) {
      throw this.exception.notFoundException({ message: 'Speech not found' });
    }
    if (speech.userId !== userId) {
      throw this.exception.unauthorizedException({
        message: 'Speech does not belong to user',
      });
    }
    return this.speechRepository.deleteSpeech(speech.id);
  }
}
