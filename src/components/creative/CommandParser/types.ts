
// Define the possible domains for commands
export type CommandDomain = 
  | "drawing" 
  | "animation" 
  | "style" 
  | "website" 
  | "transform"
  | "creative"
  | "general"
  | "unknown";

// Define the common actions available across domains
export const commonActions = [
  "create",
  "update",
  "delete",
  "get",
  "list",
  "apply",
  "generate",
  "transform",
  "extract",
  "analyze",
  "save",
  "load",
  "export"
] as const;

export type CommonAction = typeof commonActions[number];

// Base command interface
export interface ParsedCommand {
  domain: CommandDomain | string;
  action: string;
  subject: string;
  parameters: Record<string, any>;
  requiresConfirmation?: boolean;
  confidence?: number;
  instruction?: string;
  originalCommand?: string;
  confirmed?: boolean;
}

// Command with required originalCommand
export interface Command extends Omit<ParsedCommand, "originalCommand"> {
  originalCommand: string;
}

// Result of parsing a command
export interface CommandParseResult {
  success: boolean;
  command?: Command;
  error?: string;
  needsClarification?: boolean;
  clarificationQuestion?: string;
}

// Props for the CommandParser component
export interface CommandParserProps {
  instruction: string;
  onParsed: (result: CommandParseResult) => void;
  allowedDomains?: CommandDomain[];
  requireConfirmation?: boolean;
  className?: string;
  onClarificationNeeded?: (question: string, originalCommand: string) => void;
}
