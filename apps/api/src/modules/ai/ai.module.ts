import { Module } from '@nestjs/common';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { OpenAIProvider } from './providers/openai.provider';
import { WatsonXProvider } from './providers/watsonx.provider';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AIController],
  providers: [AIService, OpenAIProvider, WatsonXProvider],
  exports: [AIService],
})
export class AIModule {}
