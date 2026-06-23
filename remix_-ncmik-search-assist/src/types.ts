/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DocumentType = 'report' | 'paper' | 'guideline' | 'dataset';

export interface Paper {
  id: string;
  title: string;
  authors: string;
  institution: string;
  date: string; // e.g. "2023.11"
  year: number;
  type: DocumentType;
  isOpenAccess: boolean;
  isPeerReviewed: boolean;
  views: number;
  citations: number;
  abstract: string;
  fullText?: string;
  aiSummary: string; // Detailed AI Summary returned upon request
  citationsList?: string[]; // Citation details if applicable
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isAiSparkle?: boolean;
}

export interface FilterState {
  databases: {
    ncmik: boolean;
    pubmed: boolean;
    kmbase: boolean;
  };
  selectedYear: number;
  documentTypes: string[];
}
