import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { CreateTicketData } from '@flacroncv/shared-types';

@ApiTags('support')
@Controller('support')
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async create(@CurrentUser() user: FirebaseUser, @Body() data: CreateTicketData) {
    return this.supportService.createTicket(user.uid, user.email, user.email, data);
  }

  @Get('tickets')
  async list(@CurrentUser() user: FirebaseUser) {
    return this.supportService.listByUser(user.uid);
  }

  @Get('tickets/:id')
  async getTicket(@Param('id') id: string) {
    const ticket = await this.supportService.getTicket(id);
    const messages = await this.supportService.getMessages(id);
    return { ticket, messages };
  }

  @Post('tickets/:id/messages')
  async addMessage(
    @CurrentUser() user: FirebaseUser,
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.supportService.addMessage(id, user.uid, user.email, 'user', body.content);
  }

  @Patch('tickets/:id/close')
  async close(@Param('id') id: string) {
    return this.supportService.closeTicket(id);
  }
}
