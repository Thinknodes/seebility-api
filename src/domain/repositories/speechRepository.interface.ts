import { LengthType, SpeechM } from '@domain/model/speech';

export interface CreateSpeechArgs {
  speaker: string;
  title: string;
  topic: string;
  story: string;
  length: number;
  lengthType: LengthType;
  completedText: string;
  completionTime: number;
  tokens: number;
  userId: string;
  readingTime: number;
}

export interface SpeechRepository {
  createSpeech(data: CreateSpeechArgs): Promise<SpeechM>;
  updateSpeech(data: Partial<CreateSpeechArgs>, id: string): Promise<SpeechM>;
  getSpeechById(id: string): Promise<SpeechM>;
  getSpeechesByUserId(userId: string): Promise<SpeechM[]>;
  deleteSpeech(id: string): Promise<SpeechM>;
}
