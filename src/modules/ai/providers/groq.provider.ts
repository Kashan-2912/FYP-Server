import { Injectable } from '@nestjs/common';
import { AiProvider } from './ai-provider.interface';
import Groq from 'groq-sdk';

@Injectable()
export class GroqProvider implements AiProvider {
  private readonly apiKey: string;
  private readonly model = 'openai/gpt-oss-120b';
  private readonly groq: Groq;

  constructor() {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    this.apiKey = key;
    this.groq = new Groq({ apiKey: this.apiKey });
  }

  async generateContent(prompt: string): Promise<string> {
    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: this.model,
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: 'medium',
      stop: null,
    });
    // Assuming non-streaming for backend use, return the full content
    return chatCompletion.choices[0]?.message?.content || '';
  }
}
