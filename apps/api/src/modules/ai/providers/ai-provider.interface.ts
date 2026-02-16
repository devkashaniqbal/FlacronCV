export interface AIProviderOptions {
  maxTokens: number;
  temperature: number;
  model?: string;
}

export interface AIProviderResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  latencyMs: number;
}

export interface IAIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateText(prompt: string, options: AIProviderOptions): Promise<AIProviderResponse>;
}
