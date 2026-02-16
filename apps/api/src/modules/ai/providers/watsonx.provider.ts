import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAIProvider, AIProviderOptions, AIProviderResponse } from './ai-provider.interface';

@Injectable()
export class WatsonXProvider implements IAIProvider {
  readonly name = 'watsonx';
  private readonly logger = new Logger(WatsonXProvider.name);
  private apiKey: string;
  private url: string;
  private projectId: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('watsonx.apiKey') || '';
    this.url = this.configService.get<string>('watsonx.url') || '';
    this.projectId = this.configService.get<string>('watsonx.projectId') || '';
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.url && this.projectId);
  }

  async generateText(prompt: string, options: AIProviderOptions): Promise<AIProviderResponse> {
    if (!this.apiKey) throw new Error('WatsonX not configured');

    const start = Date.now();

    // Get IAM token
    const tokenResponse = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${this.apiKey}`,
    });
    const tokenData = (await tokenResponse.json()) as { access_token: string };

    // Generate text
    const response = await fetch(`${this.url}/ml/v1/text/generation?version=2024-05-31`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        model_id: options.model || 'ibm/granite-13b-chat-v2',
        input: prompt,
        project_id: this.projectId,
        parameters: {
          max_new_tokens: options.maxTokens,
          temperature: options.temperature,
          repetition_penalty: 1.1,
        },
      }),
    });

    const data = (await response.json()) as {
      results: Array<{ generated_text: string; generated_token_count: number }>;
      model_id: string;
    };

    return {
      content: data.results?.[0]?.generated_text || '',
      provider: 'watsonx',
      model: data.model_id || 'ibm/granite-13b-chat-v2',
      tokensUsed: data.results?.[0]?.generated_token_count || 0,
      latencyMs: Date.now() - start,
    };
  }
}
