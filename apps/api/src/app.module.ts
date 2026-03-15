import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CVModule } from './modules/cv/cv.module';
import { CoverLetterModule } from './modules/cover-letter/cover-letter.module';
import { AIModule } from './modules/ai/ai.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { ExportModule } from './modules/export/export.module';
import { PaymentModule } from './modules/payment/payment.module';
import { SupportModule } from './modules/support/support.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';
import { MailModule } from './modules/mail/mail.module';
import { CRMModule } from './modules/crm/crm.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 10,
      },
    ]),
    ScheduleModule.forRoot(),
    FirebaseModule,
    MailModule,
    AuthModule,
    UsersModule,
    CVModule,
    CoverLetterModule,
    AIModule,
    TemplatesModule,
    ExportModule,
    PaymentModule,
    SupportModule,
    AdminModule,
    AuditModule,
    CRMModule,
  ],
})
export class AppModule {}
