import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class AdminService {
  constructor(private firebaseAdmin: FirebaseAdminService) {}

  async getStats() {
    const db = this.firebaseAdmin.firestore;

    const [usersCount, cvsCount, coverLettersCount, ticketsCount] = await Promise.all([
      db.collection('users').where('isActive', '==', true).count().get(),
      db.collection('cvs').where('deletedAt', '==', null).count().get(),
      db.collection('cover_letters').where('deletedAt', '==', null).count().get(),
      db.collection('support_tickets').where('status', '==', 'open').count().get(),
    ]);

    const proUsers = await db
      .collection('users')
      .where('subscription.plan', '==', 'pro')
      .count()
      .get();

    const enterpriseUsers = await db
      .collection('users')
      .where('subscription.plan', '==', 'enterprise')
      .count()
      .get();

    return {
      totalUsers: usersCount.data().count,
      totalCVs: cvsCount.data().count,
      totalCoverLetters: coverLettersCount.data().count,
      openTickets: ticketsCount.data().count,
      proSubscribers: proUsers.data().count,
      enterpriseSubscribers: enterpriseUsers.data().count,
    };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const snapshot = await this.firebaseAdmin.firestore
      .collection('audit_logs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    return snapshot.docs.map((doc: any) => doc.data());
  }

  async getRevenueAnalytics() {
    const snapshot = await this.firebaseAdmin.firestore
      .collection('subscriptions')
      .where('status', '==', 'active')
      .get();

    let monthlyRevenue = 0;
    const planBreakdown: Record<string, number> = {};

    snapshot.docs.forEach((doc: any) => {
      const sub = doc.data();
      const amount = sub.amount / 100;
      const monthly = sub.interval === 'year' ? amount / 12 : amount;
      monthlyRevenue += monthly;
      planBreakdown[sub.plan] = (planBreakdown[sub.plan] || 0) + 1;
    });

    return {
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      activeSubscriptions: snapshot.size,
      planBreakdown,
    };
  }
}
