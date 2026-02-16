import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { IAIProvider, AIProviderOptions, AIProviderResponse } from './ai-provider.interface';

@Injectable()
export class OpenAIProvider implements IAIProvider {
  readonly name = 'openai';
  private client!: OpenAI;
  private readonly logger = new Logger(OpenAIProvider.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!this.client;
  }

  async generateText(prompt: string, options: AIProviderOptions): Promise<AIProviderResponse> {
    if (!this.client) throw new Error('OpenAI client not initialized');

    const start = Date.now();

    const completion = await this.client.chat.completions.create({
      model: options.model || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional CV and cover letter writing assistant. Provide clear, concise, and impactful content.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: options.maxTokens,
      temperature: options.temperature,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      provider: 'openai',
      model: completion.model,
      tokensUsed: completion.usage?.total_tokens || 0,
      latencyMs: Date.now() - start,
    };
  }
}
