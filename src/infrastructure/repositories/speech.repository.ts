import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/drivers/prisma/prisma.service';
import {
  CreateSpeechArgs,
  SpeechRepository,
} from '@domain/repositories/speechRepository.interface';
import { SpeechM } from '@domain/model/speech';

@Injectable()
export class SpeechRepositoryImp implements SpeechRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async deleteSpeech(id: string): Promise<SpeechM> {
    return this.prismaService.speech.delete({
      where: {
        id,
      },
    });
  }

  async getSpeechById(id: string): Promise<SpeechM> {
    return this.prismaService.speech.findUnique({
      where: {
        id,
      },
    });
  }

  async getSpeechesByUserId(userId: string): Promise<SpeechM[]> {
    return this.prismaService.speech.findMany({
      where: {
        userId,
      },
    });
  }

  async createSpeech(data: CreateSpeechArgs): Promise<SpeechM> {
    const speech = await this.prismaService.speech.create({
      data: {
        speaker: data.speaker,
        title: data.title,
        topic: data.topic,
        story: data.story,
        length: data.length,
        lengthType: data.lengthType,
        completedText: data.completedText,
        completionTime: data.completionTime,
        tokens: data.tokens,
        user: {
          connect: {
            id: data.userId,
          },
        },
        readingTime: data.readingTime,
      },
    });
    return speech;
  }

  async updateSpeech(
    data: Partial<CreateSpeechArgs>,
    id: string,
  ): Promise<SpeechM> {
    return this.prismaService.speech.update({
      where: { id },
      data,
    });
  }
}
