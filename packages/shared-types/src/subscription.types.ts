import { SubscriptionPlan, SubscriptionStatus, BillingInterval } from './enums';

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  plan: SubscriptionPlan;
  priceId: string;
  interval: BillingInterval;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAt: Date | null;
  canceledAt: Date | null;
  trialStart: Date | null;
  trialEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanConfig {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  limits: PlanLimits;
  features: string[];
}

export interface PlanLimits {
  cvs: number | 'unlimited';
  coverLetters: number | 'unlimited';
  aiCredits: number;
  templates: 'free_only' | 'all';
  exports: number | 'unlimited';
}

export const PLAN_CONFIGS: Record<SubscriptionPlan, PlanConfig> = {
  [SubscriptionPlan.FREE]: {
    name: 'Free',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: '',
    stripePriceIdYearly: '',
    limits: {
      cvs: 5,
      coverLetters: 1,
      aiCredits: 5,
      templates: 'free_only',
      exports: 2,
    },
    features: [
      '5 CVs',
      '1 Cover Letter',
      '5 AI Credits/month',
      'Free templates only',
      '2 exports/month',
      'PDF export',
    ],
  },
  [SubscriptionPlan.PRO]: {
    name: 'Pro',
    priceMonthly: 29.99,
    priceYearly: 239.88, // $19.99/mo × 12 — update your Stripe yearly price ID to match
    stripePriceIdMonthly: 'price_1T1LzDAWDS7HwRCx1DxhqRq1',
    stripePriceIdYearly: 'price_1T1M3YAWDS7HwRCx11Tl15x4',
    limits: {
      cvs: 10,
      coverLetters: 20,
      aiCredits: 100,
      templates: 'all',
      exports: 'unlimited',
    },
    features: [
      '10 CVs',
      '20 Cover Letters',
      '100 AI Credits/month',
      'All templates',
      'Unlimited exports',
      'PDF & DOCX export',
      'Priority support',
    ],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: 'Enterprise',
    priceMonthly: 99.99,
    priceYearly: 799.88, // $66.66/mo × 12 — update your Stripe yearly price ID to match
    stripePriceIdMonthly: 'price_1T1LziAWDS7HwRCxozxuJtnx',
    stripePriceIdYearly: 'price_1T1M49AWDS7HwRCxFxY8ZR5y',
    limits: {
      cvs: 'unlimited',
      coverLetters: 'unlimited',
      aiCredits: 500,
      templates: 'all',
      exports: 'unlimited',
    },
    features: [
      'Unlimited CVs',
      'Unlimited Cover Letters',
      '500 AI Credits/month',
      'All templates',
      'Unlimited exports',
      'PDF & DOCX export',
      'Priority support',
      'Custom branding',
      'Team collaboration',
    ],
  },
};
