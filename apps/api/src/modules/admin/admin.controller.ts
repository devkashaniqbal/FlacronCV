import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { SupportService } from '../support/support.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserData, SupportTicket, UserRole } from '@flacroncv/shared-types';

@ApiTags('admin')
@Controller('admin')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
    private readonly supportService: SupportService,
  ) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  async listUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('role') role?: string,
    @Query('plan') plan?: string,
  ) {
    return this.usersService.listUsers(page || 1, limit || 20, { role, plan });
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findByIdOrThrow(id);
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserData) {
    return this.usersService.update(id, data);
  }

  @Get('tickets')
  async listTickets(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.supportService.listAll(status, page || 1, limit || 20);
  }

  @Patch('tickets/:id')
  async updateTicket(@Param('id') id: string, @Body() data: Partial<SupportTicket>) {
    return this.supportService.updateTicket(id, data);
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('page') page?: number) {
    return this.adminService.getAuditLogs(page || 1);
  }

  @Get('analytics/revenue')
  async getRevenueAnalytics() {
    return this.adminService.getRevenueAnalytics();
  }
}
