import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { CurrentUser, FirebaseUser } from '../../common/decorators/current-user.decorator';

@ApiTags('export')
@Controller()
@UseGuards(FirebaseAuthGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('cvs/:id/export/pdf')
  async exportCVPdf(@CurrentUser() user: FirebaseUser, @Param('id') id: string) {
    return this.exportService.exportCVToPDF(id, user.uid);
  }

  @Post('cvs/:id/export/docx')
  async exportCVDocx(@CurrentUser() user: FirebaseUser, @Param('id') id: string) {
    return this.exportService.exportCVToDocx(id, user.uid);
  }

  @Post('cover-letters/:id/export/pdf')
  async exportCoverLetterPdf(@CurrentUser() user: FirebaseUser, @Param('id') id: string) {
    return this.exportService.exportCoverLetterToPDF(id, user.uid);
  }

  @Post('cover-letters/:id/export/docx')
  async exportCoverLetterDocx(@CurrentUser() user: FirebaseUser, @Param('id') id: string) {
    return this.exportService.exportCoverLetterToDocx(id, user.uid);
  }
}
