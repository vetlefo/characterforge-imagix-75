
export type CommandDomain = "design" | "interface" | "animation" | "data" | "navigation" | "logic" | "style" | "asset" | "system";

export interface Command {
  domain: CommandDomain | string;
  action: string;
  subject: string;
  parameters: Record<string, any>;
  originalCommand: string;
  confidence: number;
}

export interface ParsedCommand {
  domain: CommandDomain | string;
  action: string;
  subject: string;
  parameters: Record<string, any>;
  requiresConfirmation?: boolean;
  confidence?: number;
  instruction?: string;
  originalCommand?: string;
}

export interface CommandParserProps {
  onCommand?: (command: Command) => void;
  requireConfirmation?: boolean;
  allowedDomains?: CommandDomain[];
  placeholder?: string;
  className?: string;
}

export const commonActions = [
  "create",
  "update",
  "delete",
  "get",
  "list",
  "filter",
  "sort",
  "add",
  "remove",
  "modify",
  "animate",
  "transform",
  "apply",
  "generate",
  "extract",
  "convert",
  "set"
];
