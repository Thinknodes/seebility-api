import { Stream } from 'openai/streaming';
import OpenAI from 'openai';

export interface PromptGeneratorDTO {
  topic: string;
  title: string;
  story: string;
  speaker: string;
  length: number;
  lengthType: string;
}

export interface IGeneratorService {
  generateText(text: string): Promise<string>;
  streamText(
    text: string,
  ): Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>;
}

export interface IPromptGenerator {
  generateSpeechPrompt(data: PromptGeneratorDTO): Promise<string>;
}

export interface ITokenCounter {
  countTokens(text: string): Promise<number>;
}
