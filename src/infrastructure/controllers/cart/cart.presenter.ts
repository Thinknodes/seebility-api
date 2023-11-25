import { SpeechM } from '@domain/model/speech';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SpeechPresenter implements SpeechM {
  constructor(data: Partial<SpeechPresenter>) {
    Object.assign(this, data);
  }
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  speaker: string;

  @ApiResponseProperty()
  title: string;

  @ApiResponseProperty()
  topic: string;

  @ApiResponseProperty()
  story: string;

  @ApiResponseProperty()
  length: number;

  @ApiResponseProperty()
  readingTime: number;

  @ApiResponseProperty()
  createdAt: Date;

  @ApiResponseProperty()
  updatedAt: Date;

  @ApiResponseProperty()
  completedText: string;

  @ApiResponseProperty()
  completionTime: number;

  @ApiResponseProperty()
  lengthType: string;

  @Exclude()
  tokens: number;

  @Exclude()
  userId: string;
}
