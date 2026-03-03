import { Module } from '@nestjs/common';
import { CRMCustomersController } from './crm-customers.controller';
import { CRMCustomersService } from './crm-customers.service';
import { CRMLeadsController } from './crm-leads.controller';
import { CRMLeadsService } from './crm-leads.service';
import { CRMTransactionsController } from './crm-transactions.controller';
import { CRMTransactionsService } from './crm-transactions.service';
import { CRMAnalyticsController } from './crm-analytics.controller';
import { CRMAnalyticsService } from './crm-analytics.service';

@Module({
  controllers: [
    CRMCustomersController,
    CRMLeadsController,
    CRMTransactionsController,
    CRMAnalyticsController,
  ],
  providers: [
    CRMCustomersService,
    CRMLeadsService,
    CRMTransactionsService,
    CRMAnalyticsService,
  ],
  exports: [CRMCustomersService, CRMTransactionsService],
})
export class CRMModule {}
