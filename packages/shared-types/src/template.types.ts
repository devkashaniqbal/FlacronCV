import { TemplateCategory, SubscriptionPlan } from './enums';

export interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  thumbnailURL: string;
  previewImages: string[];
  htmlTemplate: string;
  cssTemplate: string;
  supportedSections: string[];
  colorSchemes: ColorScheme[];
  fontOptions: string[];
  tier: SubscriptionPlan;
  isActive: boolean;
  isFeatured: boolean;
  usageCount: number;
  rating: number;
  nameLocalized: Record<string, string>;
  descriptionLocalized: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
