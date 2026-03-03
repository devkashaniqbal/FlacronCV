import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CRMAnalyticsService } from './crm-analytics.service';
import { FirebaseAuthGuard } from '../../common/guards/firebase-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('crm-analytics')
@Controller('crm/analytics')
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@ApiBearerAuth()
export class CRMAnalyticsController {
  constructor(private readonly analyticsService: CRMAnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('revenue-chart')
  getRevenueChart() {
    return this.analyticsService.getRevenueChart();
  }

  @Get('customer-growth')
  getCustomerGrowth() {
    return this.analyticsService.getCustomerGrowthChart();
  }
}
