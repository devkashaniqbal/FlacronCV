import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { TemplateCategory, SubscriptionPlan, Template } from '@flacroncv/shared-types';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  async list(
    @Query('category') category?: TemplateCategory,
    @Query('tier') tier?: SubscriptionPlan,
  ) {
    return this.templatesService.list(category, tier);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.templatesService.findById(id);
  }

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async create(@CurrentUser() user: FirebaseUser, @Body() data: Partial<Template>) {
    return this.templatesService.create(data, user.uid);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() data: Partial<Template>) {
    return this.templatesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    await this.templatesService.delete(id);
    return { message: 'Template deleted' };
  }
}
