import { CoverLetterStatus } from './enums';

export interface CoverLetterStyling {
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  title: string;
  recipientName: string;
  recipientTitle?: string;
  companyName: string;
  companyAddress?: string;
  jobTitle: string;
  jobDescription?: string;
  content: string;
  templateId: string;
  styling: CoverLetterStyling;
  aiGenerated: boolean;
  aiProvider: string | null;
  linkedCVId: string | null;
  status: CoverLetterStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GenerateCoverLetterData {
  jobTitle: string;
  companyName: string;
  recipientName?: string;
  jobDescription?: string;
  tone?: 'professional' | 'friendly' | 'enthusiastic' | 'formal';
  linkedCVId?: string;
}
