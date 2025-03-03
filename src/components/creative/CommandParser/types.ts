
import { Intent } from './intentClassifier';

export interface CommandParserProps {
  instruction: string;
  onParsed: (result: CommandParseResult) => void;
  onClarificationNeeded: (question: string, originalCommand: string) => void;
  requireConfirmation?: boolean;
  allowedDomains?: string[];
  className?: string;
  confidenceThreshold?: number;
}

export interface Command {
  originalText: string;
  domain: string;
  action: string;
  parameters: Record<string, any>;
  intent?: Intent;
  confidence?: number;
  subject?: string;
  originalCommand?: string;
}

export interface CommandParseResult {
  command: Command;
  confidence: number;
  rawInput: string;
  success?: boolean;
  needsClarification?: boolean;
  clarificationQuestion?: string;
  error?: string;
}

export type CommandDomain = 'drawing' | 'styling' | 'animation' | 'website' | 'general' | 'transform' | 'media' | 'creative';

export interface CommandParserIntegrationProps {
  onExecuteCommand?: (command: Command) => void;
  allowedDomains?: string[];
  instruction?: string;
}

export interface DomainHandler {
  execute: (command: Command) => void;
  canHandle: (command: Command) => boolean;
}

// These interfaces are needed for ConversationalInterface.tsx
export interface MessageContent {
  type: string;
  content: string;
}

export interface ConversationMessage {
  id?: string;
  sender: string;
  content: MessageContent;
  timestamp?: Date;
  actions?: Action[];
  metadata?: Record<string, any>;
  intentData?: {
    type: string;
    confidence: number;
    parameters: Record<string, any>;
  };
}

export interface Action {
  type: string;
  label: string;
  payload: Record<string, any>;
}
