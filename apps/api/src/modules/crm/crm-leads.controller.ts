import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CRMLeadsService } from './crm-leads.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';
import { CreateCRMLeadDto, UpdateCRMLeadDto, CRMLeadStage } from '@flacroncv/shared-types';

@ApiTags('crm-leads')
@Controller('crm/leads')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@ApiBearerAuth()
export class CRMLeadsController {
  constructor(private readonly leadsService: CRMLeadsService) {}

  @Post()
  create(@Body() dto: CreateCRMLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('stage') stage?: CRMLeadStage,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.leadsService.list({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      search,
      stage,
      assignedTo,
    });
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const leads = await this.leadsService.getAllForExport();

    const header = [
      'ID', 'Name', 'Email', 'Phone', 'Company',
      'Source', 'Stage', 'Assigned To', 'Notes', 'Created At',
    ].join(',');

    const rows = leads.map((l) =>
      [
        l.id,
        `"${l.name.replace(/"/g, '""')}"`,
        l.email,
        l.phone ?? '',
        l.company ? `"${l.company.replace(/"/g, '""')}"` : '',
        l.source,
        l.stage,
        l.assignedToName ?? '',
        l.notes ? `"${l.notes.replace(/"/g, '""')}"` : '',
        new Date(l.createdAt).toISOString(),
      ].join(','),
    );

    const csv = [header, ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCRMLeadDto) {
    return this.leadsService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.leadsService.delete(id);
  }

  @Post(':id/convert')
  convert(@Param('id') id: string, @CurrentUser() user: FirebaseUser) {
    return this.leadsService.convertToCustomer(id, user.uid, user.email);
  }
}
