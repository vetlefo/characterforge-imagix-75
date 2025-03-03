
import { CommandDomain } from './domains';
import { ExtractedParameters } from './parameterExtractor';

// Base command structure
export interface ParsedCommand {
  instruction: string;
  action: string;
  subject: string;
  domain: CommandDomain;
  parameters: ExtractedParameters;
  confidence: number; // 0-1 measure of parsing confidence
  requiresConfirmation: boolean;
  confirmed: boolean;
}

// Domain-specific command structures
export interface DrawingCommand extends ParsedCommand {
  domain: 'drawing';
  parameters: ExtractedParameters & {
    brushType?: 'pencil' | 'spray' | 'eraser';
    drawingMode?: 'pencil' | 'line' | 'rectangle' | 'circle' | 'select' | 'spray' | 'eraser';
  };
}

export interface StylingCommand extends ParsedCommand {
  domain: 'styling';
  parameters: ExtractedParameters & {
    fontFamily?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontWeight?: string;
  };
}

export interface AnimationCommand extends ParsedCommand {
  domain: 'animation';
  parameters: ExtractedParameters & {
    duration?: number;
    delay?: number;
    easing?: string;
    repeat?: number | 'infinite';
  };
}

export interface WebsiteCommand extends ParsedCommand {
  domain: 'website';
  parameters: ExtractedParameters & {
    html?: string;
    css?: string;
    js?: string;
    viewport?: 'desktop' | 'tablet' | 'mobile';
  };
}

// Type union for all command types
export type Command = DrawingCommand | StylingCommand | AnimationCommand | WebsiteCommand | ParsedCommand;

// Function signature for command handlers
export type CommandHandler = (command: Command) => void;

// Props for the CommandParser component
export interface CommandParserProps {
  instruction: string;
  onParsed?: CommandHandler;
  allowedDomains?: CommandDomain[];
  requireConfirmation?: boolean;
  className?: string;
}

// Common actions across domains
export const commonActions = [
  'create', 'make', 'generate', 'add',
  'modify', 'change', 'update', 'edit',
  'delete', 'remove', 'clear',
  'show', 'display', 'hide',
  'save', 'export', 'load', 'import'
];
