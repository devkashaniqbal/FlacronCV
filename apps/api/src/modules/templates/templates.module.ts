import { Module, OnModuleInit } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule implements OnModuleInit {
  constructor(private readonly templatesService: TemplatesService) {}

  async onModuleInit() {
    await this.templatesService.seedDefaults();
  }
}
