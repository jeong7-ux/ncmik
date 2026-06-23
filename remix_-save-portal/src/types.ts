export interface VersionDiff {
  lines: Array<{
    type: 'add' | 'remove' | 'normal';
    text: string;
  }>;
  addedCount: number;
  removedCount: number;
}

export interface VersionInfo {
  id: string; // e.g. "v2.4.1"
  label: string; // e.g. "v2.4.1 (현재)"
  title: string;
  date: string;
  summary: string;
  signer: string; // e.g. "Dr. Aris Thorne"
  signerAvatar?: string;
  diff?: VersionDiff;
}

export interface DocumentRelationship {
  type: 'revision' | 'derivation' | 'obsolete' | 'reference';
  targetId: string;
  targetTitle: string;
  note: string;
}

export interface ArchiveDocument {
  id: string; // e.g. "ARCH-2024-DRU-098"
  title: string;
  description: string;
  currentVersion: string; // e.g. "v2.4.1"
  category: string; // e.g. "COVID-19", "MERS", "H1N1"
  type: string; // e.g. "PDF, JSON, CSV", "일반 데이터", "의료 보고서"
  status: 'active' | 'archived' | 'obsolete'; // 활성, 보관, 폐지
  stability: number; // e.g. 100, 75, 25 (stabilization score)
  lastUpdated: string;
  authors: string[];
  versions: VersionInfo[];
  relationships: DocumentRelationship[];
}

export interface AuditLogEntry {
  id: string;
  time: string;
  date: string;
  action: string;
  trigger: string; 
  docId: string;
  type: 'system' | 'editorial' | 'obsolete' | 'critical';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}
