import {
  CRMCustomerStatus,
  CRMLeadStage,
  CRMTransactionStatus,
  CRMCustomerSource,
  CRMActivityType,
} from './enums';

// ─── Core Entities ───────────────────────────────────────────────────────────

export interface CRMNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface CRMCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: CRMCustomerStatus;
  tags: string[];
  totalRevenue: number;
  source: CRMCustomerSource;
  notes: CRMNote[];
  lastActivity: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: CRMCustomerSource;
  stage: CRMLeadStage;
  assignedTo: string | null;
  assignedToName: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMTransaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  description: string | null;
  date: Date;
  status: CRMTransactionStatus;
  createdAt: Date;
}

export interface CRMActivity {
  id: string;
  customerId: string;
  type: CRMActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface CRMMonthlyComparison {
  customers: number; // % change vs last month
  revenue: number;
  leads: number;
}

export interface CRMAnalyticsOverview {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalLeads: number;
  conversionRate: number; // % of leads converted to customers
  avgRevenuePerCustomer: number;
  thisMonthVsLastMonth: CRMMonthlyComparison;
}

export interface CRMRevenueDataPoint {
  month: string; // e.g. "Jan 2025"
  revenue: number;
  transactions: number;
}

export interface CRMCustomerGrowthDataPoint {
  month: string;
  customers: number;
  leads: number;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface CreateCRMCustomerDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: CRMCustomerStatus;
  source?: CRMCustomerSource;
  tags?: string[];
}

export interface UpdateCRMCustomerDto {
  name?: string;
  phone?: string;
  company?: string;
  status?: CRMCustomerStatus;
  tags?: string[];
  source?: CRMCustomerSource;
}

export interface CreateCRMLeadDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: CRMCustomerSource;
  stage?: CRMLeadStage;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
}

export interface UpdateCRMLeadDto {
  name?: string;
  phone?: string;
  company?: string;
  stage?: CRMLeadStage;
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
}

export interface CreateCRMTransactionDto {
  customerId: string;
  customerName: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  description?: string;
  date?: string; // ISO string
  status?: CRMTransactionStatus;
}

export interface AddCRMNoteDto {
  content: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface CRMCustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CRMCustomerStatus;
  source?: CRMCustomerSource;
  sortBy?: 'name' | 'createdAt' | 'totalRevenue' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface CRMLeadListParams {
  page?: number;
  limit?: number;
  search?: string;
  stage?: CRMLeadStage;
  assignedTo?: string;
}

export interface CRMTransactionListParams {
  page?: number;
  limit?: number;
  customerId?: string;
  status?: CRMTransactionStatus;
  startDate?: string;
  endDate?: string;
}
