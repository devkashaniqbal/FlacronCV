import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';
import {
  CRMAnalyticsOverview,
  CRMRevenueDataPoint,
  CRMCustomerGrowthDataPoint,
  CRMCustomer,
  CRMLead,
  CRMTransaction,
  CRMCustomerStatus,
  CRMTransactionStatus,
} from '@flacroncv/shared-types';

@Injectable()
export class CRMAnalyticsService {
  constructor(private firebase: FirebaseAdminService) {}

  async getOverview(): Promise<CRMAnalyticsOverview> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [customersSnap, leadsSnap, transactionsSnap] = await Promise.all([
      this.firebase.firestore.collection('crm_customers').get(),
      this.firebase.firestore.collection('crm_leads').get(),
      this.firebase.firestore.collection('crm_transactions').get(),
    ]);

    const customers: CRMCustomer[] = customersSnap.docs.map((d: any) => d.data() as CRMCustomer);
    const leads: CRMLead[] = leadsSnap.docs.map((d: any) => d.data() as CRMLead);
    const transactions: CRMTransaction[] = transactionsSnap.docs.map((d: any) => d.data() as CRMTransaction);
    const completedTx: CRMTransaction[] = transactions.filter((t: CRMTransaction) => t.status === CRMTransactionStatus.COMPLETED);

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: CRMCustomer) => c.status === CRMCustomerStatus.ACTIVE).length;

    const newCustomersThisMonth = customers.filter(
      (c: CRMCustomer) => new Date(c.createdAt) >= startOfMonth,
    ).length;

    const newCustomersLastMonth = customers.filter((c: CRMCustomer) => {
      const d = new Date(c.createdAt);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    }).length;

    const totalRevenue = completedTx.reduce((s: number, t: CRMTransaction) => s + t.amount, 0);

    const monthlyRevenue = completedTx
      .filter((t: CRMTransaction) => new Date(t.date) >= startOfMonth)
      .reduce((s: number, t: CRMTransaction) => s + t.amount, 0);

    const lastMonthRevenue = completedTx
      .filter((t: CRMTransaction) => {
        const d = new Date(t.date);
        return d >= startOfLastMonth && d <= endOfLastMonth;
      })
      .reduce((s: number, t: CRMTransaction) => s + t.amount, 0);

    const totalLeads = leads.length;
    const newLeadsThisMonth = leads.filter((l: CRMLead) => new Date(l.createdAt) >= startOfMonth).length;
    const newLeadsLastMonth = leads.filter((l: CRMLead) => {
      const d = new Date(l.createdAt);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    }).length;

    const conversionRate =
      totalLeads + totalCustomers > 0
        ? (totalCustomers / (totalLeads + totalCustomers)) * 100
        : 0;

    const avgRevenuePerCustomer = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    const pctChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    };

    return {
      totalCustomers,
      activeCustomers,
      newCustomersThisMonth,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      totalLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgRevenuePerCustomer: Math.round(avgRevenuePerCustomer * 100) / 100,
      thisMonthVsLastMonth: {
        customers: pctChange(newCustomersThisMonth, newCustomersLastMonth),
        revenue: pctChange(monthlyRevenue, lastMonthRevenue),
        leads: pctChange(newLeadsThisMonth, newLeadsLastMonth),
      },
    };
  }

  async getRevenueChart(): Promise<CRMRevenueDataPoint[]> {
    const snapshot = await this.firebase.firestore
      .collection('crm_transactions')
      .where('status', '==', CRMTransactionStatus.COMPLETED)
      .get();

    const transactions: CRMTransaction[] = snapshot.docs.map((d: any) => d.data() as CRMTransaction);

    // Group by YYYY-MM
    const byMonth = new Map<string, { revenue: number; transactions: number; label: string }>();

    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

      if (!byMonth.has(key)) byMonth.set(key, { revenue: 0, transactions: 0, label });
      const entry = byMonth.get(key)!;
      entry.revenue += t.amount;
      entry.transactions += 1;
    }

    // Last 12 months
    const result: CRMRevenueDataPoint[] = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      const entry = byMonth.get(key) ?? { revenue: 0, transactions: 0, label };
      result.push({ month: entry.label, revenue: Math.round(entry.revenue * 100) / 100, transactions: entry.transactions });
    }

    return result;
  }

  async getCustomerGrowthChart(): Promise<CRMCustomerGrowthDataPoint[]> {
    const [customersSnap, leadsSnap] = await Promise.all([
      this.firebase.firestore.collection('crm_customers').get(),
      this.firebase.firestore.collection('crm_leads').get(),
    ]);

    const customers: CRMCustomer[] = customersSnap.docs.map((d: any) => d.data() as CRMCustomer);
    const leads: CRMLead[] = leadsSnap.docs.map((d: any) => d.data() as CRMLead);

    const byMonth = new Map<string, { customers: number; leads: number; label: string }>();
    const now = new Date();

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      byMonth.set(key, { customers: 0, leads: 0, label });
    }

    for (const c of customers) {
      const d = new Date(c.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (byMonth.has(key)) byMonth.get(key)!.customers += 1;
    }

    for (const l of leads) {
      const d = new Date(l.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (byMonth.has(key)) byMonth.get(key)!.leads += 1;
    }

    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => ({ month: v.label, customers: v.customers, leads: v.leads }));
  }
}
