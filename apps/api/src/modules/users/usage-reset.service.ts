import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import { PLAN_CONFIGS, SubscriptionPlan } from '@flacroncv/shared-types';

@Injectable()
export class UsageResetService {
  private readonly logger = new Logger(UsageResetService.name);

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  /**
   * Runs at midnight on the 1st of every month.
   * Resets aiCreditsUsed and exportsThisMonth for all active users,
   * and syncs aiCreditsLimit to the user's current plan.
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetMonthlyUsage(): Promise<void> {
    this.logger.log('Starting monthly usage reset...');

    try {
      const snapshot = await this.firebaseAdmin.firestore
        .collection('users')
        .where('isActive', '==', true)
        .get();

      const batch = this.firebaseAdmin.firestore.batch();
      const now = new Date();
      let count = 0;

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const plan = (data.subscription?.plan as SubscriptionPlan) || SubscriptionPlan.FREE;
        const newCreditsLimit = PLAN_CONFIGS[plan]?.limits?.aiCredits ?? 5;

        batch.update(doc.ref, {
          'usage.aiCreditsUsed': 0,
          'usage.exportsThisMonth': 0,
          'usage.aiCreditsLimit': newCreditsLimit,
          'usage.lastExportReset': now,
          updatedAt: now,
        });

        count++;

        // Firestore batch limit is 500 writes
        if (count % 500 === 0) {
          await batch.commit();
          this.logger.log(`Reset ${count} users...`);
        }
      }

      await batch.commit();
      this.logger.log(`Monthly usage reset complete. ${count} users reset.`);
    } catch (error) {
      this.logger.error('Monthly usage reset failed', (error as Error).message);
    }
  }
}
