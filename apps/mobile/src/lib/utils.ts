import { SubscriptionPlan } from '../types/enums';
import { PLAN_CONFIGS } from '../types/subscription.types';

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function canAccessTemplate(
  userPlan: SubscriptionPlan,
  templateTier: SubscriptionPlan,
): boolean {
  const hierarchy: Record<SubscriptionPlan, number> = {
    [SubscriptionPlan.FREE]: 0,
    [SubscriptionPlan.PRO]: 1,
    [SubscriptionPlan.ENTERPRISE]: 2,
  };
  return hierarchy[userPlan] >= hierarchy[templateTier];
}

export function canCreateCV(
  plan: SubscriptionPlan,
  cvsCreated: number,
): boolean {
  const limit = PLAN_CONFIGS[plan].limits.cvs;
  if (limit === 'unlimited') return true;
  return cvsCreated < (limit as number);
}

export function canCreateCoverLetter(
  plan: SubscriptionPlan,
  clCreated: number,
): boolean {
  const limit = PLAN_CONFIGS[plan].limits.coverLetters;
  if (limit === 'unlimited') return true;
  return clCreated < (limit as number);
}

export function canUseAI(
  plan: SubscriptionPlan,
  aiCreditsUsed: number,
): boolean {
  const limit = PLAN_CONFIGS[plan].limits.aiCredits;
  if (limit === 'unlimited') return true;
  return aiCreditsUsed < (limit as number);
}

export function canExport(
  plan: SubscriptionPlan,
  exportsThisMonth: number,
): boolean {
  const limit = PLAN_CONFIGS[plan].limits.exports;
  if (limit === 'unlimited') return true;
  return exportsThisMonth < (limit as number);
}

export function planHasWatermark(plan: SubscriptionPlan): boolean {
  return plan === SubscriptionPlan.FREE;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
