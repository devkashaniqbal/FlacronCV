import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly client: BrevoClient;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly templates: { welcome: number; verification: number; passwordReset: number };

  constructor(private config: ConfigService) {
    this.fromEmail = this.config.get<string>('brevo.fromEmail') || 'noreply@flacroncv.com';
    this.fromName = this.config.get<string>('brevo.fromName') || 'FlacronCV';
    this.templates = this.config.get('brevo.templates') ?? { welcome: 0, verification: 0, passwordReset: 0 };

    this.client = new BrevoClient({
      apiKey: this.config.get<string>('brevo.apiKey') || '',
    });
  }

  async sendWelcomeEmail(email: string, displayName: string): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email, name: displayName || email }],
        templateId: this.templates.welcome,
        params: {
          firstName: displayName?.split(' ')[0] || 'there',
          dashboardUrl: `${this.config.get<string>('frontendUrl')}/dashboard`,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send welcome email to ${email}`, err);
    }
  }

  async sendPasswordResetEmail(email: string, displayName: string, resetUrl: string): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email, name: displayName || email }],
        templateId: this.templates.passwordReset,
        params: {
          resetUrl,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send password reset email to ${email}`, err);
      throw err;
    }
  }

  async sendEmailVerificationEmail(email: string, displayName: string, verificationUrl: string): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email, name: displayName || email }],
        templateId: this.templates.verification,
        params: {
          verificationUrl,
          currentYear: new Date().getFullYear(),
        },
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (err) {
      this.logger.error(`Failed to send verification email to ${email}`, err);
      throw err;
    }
  }
}
