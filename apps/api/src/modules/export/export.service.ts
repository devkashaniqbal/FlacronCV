import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { CVService } from '../cv/cv.service';
import { CoverLetterService } from '../cover-letter/cover-letter.service';
import { UsersService } from '../users/users.service';
import { PLAN_CONFIGS } from '@flacroncv/shared-types';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor(
    private firebaseAdmin: FirebaseAdminService,
    private cvService: CVService,
    private coverLetterService: CoverLetterService,
    private usersService: UsersService,
  ) {
    this.loadTemplates();
  }

  private async checkExportLimit(userId: string): Promise<void> {
    const user = await this.usersService.findByIdOrThrow(userId);
    const limits = PLAN_CONFIGS[user.subscription.plan].limits;
    if (limits.exports !== 'unlimited' && user.usage.exportsThisMonth >= limits.exports) {
      throw new ForbiddenException(
        `Export limit reached for your plan (${limits.exports}/month). Please upgrade.`,
      );
    }
  }

  private loadTemplates() {
    const templateDir = path.join(__dirname, '..', '..', 'templates', 'cv');
    try {
      if (fs.existsSync(templateDir)) {
        const files = fs.readdirSync(templateDir);
        files.forEach((file) => {
          if (file.endsWith('.hbs')) {
            const name = file.replace('.hbs', '');
            const content = fs.readFileSync(path.join(templateDir, file), 'utf-8');
            this.templates.set(name, Handlebars.compile(content));
            this.logger.log(`Loaded template: ${name}`);
          }
        });
      }
    } catch (error) {
      this.logger.warn('Could not load templates directory');
    }
  }

  async exportCVToPDF(cvId: string, userId: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
    await this.checkExportLimit(userId);
    const cv = await this.cvService.findByIdOrThrow(cvId, userId);
    const sections = await this.cvService.getSections(cvId);

    // Build HTML from template
    const html = this.renderCVHTML(cv, sections);

    // Use Puppeteer for PDF generation
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      });

      // Upload to Firebase Storage
      const fileName = `exports/${userId}/${uuidv4()}.pdf`;
      const file = this.firebaseAdmin.bucket.file(fileName);
      await file.save(Buffer.from(pdfBuffer), {
        metadata: { contentType: 'application/pdf' },
      });

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      await this.usersService.incrementUsage(userId, 'exportsThisMonth');

      return { downloadUrl: url, expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
    } finally {
      await browser.close();
    }
  }

  async exportCVToDocx(cvId: string, userId: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
    await this.checkExportLimit(userId);
    const cv = await this.cvService.findByIdOrThrow(cvId, userId);
    const sections = await this.cvService.getSections(cvId);

    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

    const children: any[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`,
            bold: true,
            size: 32,
          }),
        ],
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        children: [new TextRun({ text: cv.personalInfo.headline, italics: true, size: 24 })],
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${cv.personalInfo.email} | ${cv.personalInfo.phone} | ${cv.personalInfo.city}, ${cv.personalInfo.country}`,
            size: 20,
          }),
        ],
      }),
      new Paragraph({ text: '' }),
    ];

    if (cv.personalInfo.summary) {
      children.push(
        new Paragraph({ text: 'Professional Summary', heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ children: [new TextRun({ text: cv.personalInfo.summary })] }),
        new Paragraph({ text: '' }),
      );
    }

    for (const section of sections) {
      if (!section.isVisible) continue;
      children.push(
        new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1 }),
      );

      for (const item of section.items) {
        const itemRecord = item as unknown as Record<string, unknown>;
        if (itemRecord.company) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${itemRecord.position}`, bold: true }),
                new TextRun({ text: ` at ${itemRecord.company}` }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${itemRecord.startDate} - ${itemRecord.endDate || 'Present'}`,
                  italics: true,
                }),
              ],
            }),
          );
          if (itemRecord.description) {
            children.push(new Paragraph({ text: itemRecord.description as string }));
          }
        } else if (itemRecord.institution) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: `${itemRecord.degree} in ${itemRecord.field}`, bold: true }),
                new TextRun({ text: ` - ${itemRecord.institution}` }),
              ],
            }),
          );
        } else if (itemRecord.name) {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `${itemRecord.name}${itemRecord.level ? ` (${itemRecord.level})` : ''}` })],
            }),
          );
        }
      }
      children.push(new Paragraph({ text: '' }));
    }

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const buffer = await Packer.toBuffer(doc);

    const fileName = `exports/${userId}/${uuidv4()}.docx`;
    const file = this.firebaseAdmin.bucket.file(fileName);
    await file.save(Buffer.from(buffer), {
      metadata: { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    await this.usersService.incrementUsage(userId, 'exportsThisMonth');

    return { downloadUrl: url, expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
  }

  private renderCVHTML(cv: any, sections: any[]): string {
    const template = this.templates.get(cv.templateId);
    if (template) {
      return template({ cv, sections });
    }

    // Fallback inline template
    return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: ${cv.styling.fontFamily}, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; }
  h1 { color: ${cv.styling.primaryColor}; font-size: 28px; margin-bottom: 4px; }
  h2 { color: ${cv.styling.primaryColor}; font-size: 18px; border-bottom: 2px solid ${cv.styling.primaryColor}; padding-bottom: 4px; margin: 20px 0 10px; }
  .header { text-align: center; margin-bottom: 24px; }
  .headline { font-size: 16px; color: #555; margin-bottom: 8px; }
  .contact { font-size: 13px; color: #666; }
  .summary { margin-bottom: 16px; font-size: 14px; }
  .section { margin-bottom: 16px; }
  .item { margin-bottom: 12px; }
  .item-header { display: flex; justify-content: space-between; align-items: baseline; }
  .item-title { font-weight: 600; font-size: 15px; }
  .item-subtitle { color: #555; font-size: 14px; }
  .item-date { color: #888; font-size: 13px; }
  .item-desc { font-size: 14px; margin-top: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: ${cv.styling.primaryColor}15; color: ${cv.styling.primaryColor}; padding: 4px 12px; border-radius: 4px; font-size: 13px; }
</style>
</head>
<body>
  <div class="header">
    <h1>${cv.personalInfo.firstName} ${cv.personalInfo.lastName}</h1>
    <div class="headline">${cv.personalInfo.headline}</div>
    <div class="contact">${cv.personalInfo.email} | ${cv.personalInfo.phone} | ${cv.personalInfo.city}, ${cv.personalInfo.country}</div>
  </div>
  ${cv.personalInfo.summary ? `<div class="summary"><h2>Professional Summary</h2><p>${cv.personalInfo.summary}</p></div>` : ''}
  ${sections
    .filter((s: any) => s.isVisible)
    .map(
      (section: any) => `
    <div class="section">
      <h2>${section.title}</h2>
      ${section.items
        .map((item: any) => {
          if (item.company) {
            return `<div class="item">
              <div class="item-header"><span class="item-title">${item.position}</span><span class="item-date">${item.startDate} - ${item.endDate || 'Present'}</span></div>
              <div class="item-subtitle">${item.company}${item.location ? ` | ${item.location}` : ''}</div>
              ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
            </div>`;
          }
          if (item.institution) {
            return `<div class="item">
              <div class="item-header"><span class="item-title">${item.degree} in ${item.field}</span><span class="item-date">${item.startDate} - ${item.endDate || 'Present'}</span></div>
              <div class="item-subtitle">${item.institution}</div>
            </div>`;
          }
          if (item.name && section.type === 'skills') {
            return `<span class="skill-tag">${item.name}</span>`;
          }
          return `<div class="item"><span class="item-title">${item.name || item.title || ''}</span></div>`;
        })
        .join('')}
    </div>`,
    )
    .join('')}
</body>
</html>`;
  }

  async exportCoverLetterToPDF(coverLetterId: string, userId: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
    await this.checkExportLimit(userId);
    const coverLetter = await this.coverLetterService.findByIdOrThrow(coverLetterId, userId);

    // Build HTML from cover letter
    const html = this.renderCoverLetterHTML(coverLetter);

    // Use Puppeteer for PDF generation
    const puppeteer = await import('puppeteer');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' },
      });

      // Upload to Firebase Storage
      const fileName = `exports/${userId}/${uuidv4()}.pdf`;
      const file = this.firebaseAdmin.bucket.file(fileName);
      await file.save(Buffer.from(pdfBuffer), {
        metadata: { contentType: 'application/pdf' },
      });

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 1 hour
      });

      await this.usersService.incrementUsage(userId, 'exportsThisMonth');

      return { downloadUrl: url, expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
    } finally {
      await browser.close();
    }
  }

  async exportCoverLetterToDocx(coverLetterId: string, userId: string): Promise<{ downloadUrl: string; expiresAt: Date }> {
    await this.checkExportLimit(userId);
    const coverLetter = await this.coverLetterService.findByIdOrThrow(coverLetterId, userId);

    const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');

    const children: any[] = [];

    // Add date (top-right aligned)
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    children.push(
      new Paragraph({
        children: [new TextRun({ text: currentDate, size: 22 })],
        alignment: AlignmentType.RIGHT,
      }),
      new Paragraph({ text: '' })
    );

    // Add recipient info if available
    if (coverLetter.recipientName || coverLetter.companyName) {
      if (coverLetter.recipientName) {
        children.push(new Paragraph({
          children: [new TextRun({ text: coverLetter.recipientName, size: 22 })]
        }));
      }
      if (coverLetter.recipientTitle) {
        children.push(new Paragraph({
          children: [new TextRun({ text: coverLetter.recipientTitle, size: 22 })]
        }));
      }
      if (coverLetter.companyName) {
        children.push(new Paragraph({
          children: [new TextRun({ text: coverLetter.companyName, size: 22 })]
        }));
      }
      if (coverLetter.companyAddress) {
        children.push(new Paragraph({
          children: [new TextRun({ text: coverLetter.companyAddress, size: 22 })]
        }));
      }
      children.push(new Paragraph({ text: '' }));
    }

    // Add subject line if job title exists
    if (coverLetter.jobTitle) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `RE: ${coverLetter.jobTitle}`, bold: true, size: 22 })],
        }),
        new Paragraph({ text: '' })
      );
    }

    // Parse HTML content and convert to paragraphs
    const contentText = coverLetter.content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .trim();

    const paragraphs = contentText.split('\n').filter(p => p.trim());
    paragraphs.forEach(para => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: para.trim(), size: 22 })],
          spacing: { after: 200 },
        })
      );
    });

    const doc = new Document({ sections: [{ properties: {}, children }] });
    const buffer = await Packer.toBuffer(doc);

    const fileName = `exports/${userId}/${uuidv4()}.docx`;
    const file = this.firebaseAdmin.bucket.file(fileName);
    await file.save(Buffer.from(buffer), {
      metadata: { contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    });

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000,
    });

    await this.usersService.incrementUsage(userId, 'exportsThisMonth');

    return { downloadUrl: url, expiresAt: new Date(Date.now() + 60 * 60 * 1000) };
  }

  private renderCoverLetterHTML(coverLetter: any): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${coverLetter.styling.fontFamily}, sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    padding: 60px 80px;
    font-size: ${coverLetter.styling.fontSize};
  }
  .date { text-align: right; margin-bottom: 24px; }
  .recipient { margin-bottom: 24px; }
  .recipient-line { margin-bottom: 4px; }
  .subject { font-weight: 600; margin-bottom: 24px; color: ${coverLetter.styling.primaryColor}; }
  .content { margin-bottom: 24px; }
  .content p { margin-bottom: 16px; }
</style>
</head>
<body>
  <div class="date">${currentDate}</div>
  ${coverLetter.recipientName || coverLetter.companyName ? `
  <div class="recipient">
    ${coverLetter.recipientName ? `<div class="recipient-line">${coverLetter.recipientName}</div>` : ''}
    ${coverLetter.recipientTitle ? `<div class="recipient-line">${coverLetter.recipientTitle}</div>` : ''}
    ${coverLetter.companyName ? `<div class="recipient-line">${coverLetter.companyName}</div>` : ''}
    ${coverLetter.companyAddress ? `<div class="recipient-line">${coverLetter.companyAddress}</div>` : ''}
  </div>
  ` : ''}
  ${coverLetter.jobTitle ? `<div class="subject">RE: ${coverLetter.jobTitle}</div>` : ''}
  <div class="content">${coverLetter.content}</div>
</body>
</html>`;
  }
}
