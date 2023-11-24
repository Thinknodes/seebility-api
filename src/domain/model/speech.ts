export enum LengthType {
  TIME = 'TIME',
  WORD = 'WORD',
}

export const LengthTypeValue = {
  TIME: 'TIME',
  WORD: 'WORD',
};

export class SpeechM {
  id: string;
  speaker: string;
  title: string;
  topic: string;
  story: string;
  length: number;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
  completedText: string;
  completionTime: number;
  lengthType: (typeof LengthTypeValue)[keyof typeof LengthTypeValue];
  tokens: number;
  userId: string;

  constructor(data: Partial<SpeechM>) {
    Object.assign(this, data);
  }
}
