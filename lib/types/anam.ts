/**
 * Anam AI TypeScript Type Definitions
 */

export interface AnamSessionTokenResponse {
  sessionToken: string;
}

export interface AnamError {
  error: string;
  details?: string;
}

export enum AnamConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}

export interface AnamMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Re-export SDK types if needed
export type { AnamPersonaConfig } from '@/config/anam.config';
