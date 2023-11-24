import { Injectable, Inject } from '@nestjs/common';
import {
  IGeneratorService,
  IPromptGenerator,
  PromptGeneratorDTO,
  ITokenCounter,
} from '@domain/adapters/ai.interface';
import OpenAI from 'openai';
import { OPEN_API_PROVIDER } from './provider';
import { encoding_for_model } from '@dqbd/tiktoken';

const MODEL = 'gpt-4';

@Injectable()
export class GeneratorService implements IGeneratorService {
  constructor(
    @Inject(OPEN_API_PROVIDER)
    private readonly openai: OpenAI,
  ) {}

  async generateText(text: string): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: text }],
      model: MODEL,
    });
    return chatCompletion.choices[0].message.content;
  }

  async streamText(text: string) {
    return this.openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: text }],
      stream: true,
    });
  }
}

@Injectable()
export class PromptGenerator implements IPromptGenerator {
  async generateSpeechPrompt(data: PromptGeneratorDTO): Promise<string> {
    const { topic, title, story, speaker, length, lengthType } = data;
    const lengthOfWords = lengthType == 'WORD' ? length : length * 250;
    const sentences = lengthOfWords / 15;
    const paragraphs = sentences / 5;
    const prompt = `
    Compose a speech on the topic of ${topic}, incorporating the following details:

- The speech should align with the overarching theme titled "${title}".
- It will be delivered by ${speaker}.
- The speech should be ${length} ${
      lengthType == 'WORD' ? 'words' : 'minutes'
    } long, focusing on conciseness and impact.
- Here is a short narrative to provide background and context for the speech:
  ${story}
- Important Notes:
  - The speech should not explicitly state the title, speaker, or length.
  - The content must meet the specified length requirement.
  - The tone should be [insert desired tone, if any; leave blank if not applicable].
  - Ensure key themes from the short narrative are woven into the speech for coherence and depth.
  - The speech should be structured as follows:
    - Introduction: [insert introduction and must be at least 15 sentences]
    - Body: [insert body and must be at least ${paragraphs} paragraphs]
    - Conclusion: [insert conclusion and must be at least 15 sentences]
    - The speech should expand on each section and delve real deep into the topic.
    `;
    console.log(prompt);
    return prompt;
  }
}

@Injectable()
export class TokenCounter implements ITokenCounter {
  async countTokens(text: string): Promise<number> {
    const encoder = encoding_for_model(MODEL);
    const tokens = encoder.encode(text);
    const length = tokens.length;
    encoder.free();
    return length;
  }
}
