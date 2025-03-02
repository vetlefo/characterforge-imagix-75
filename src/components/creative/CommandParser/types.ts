
export type CommandIntent = 
  | "create" 
  | "modify" 
  | "delete" 
  | "arrange" 
  | "style" 
  | "animate" 
  | "save" 
  | "export" 
  | "unknown";

export type CommandEntity = 
  | "shape" 
  | "text" 
  | "image" 
  | "layer" 
  | "color" 
  | "size" 
  | "position" 
  | "effect" 
  | "unknown";

export type CommandAttribute = {
  key: string;
  value: string | number | boolean;
};

export type ParsedCommand = {
  intent: CommandIntent;
  entity: CommandEntity;
  attributes: CommandAttribute[];
  rawText: string;
  confidence: number; // 0-1 value indicating confidence in the parse
};

export type CommandAction = {
  type: string;
  payload: any;
};

export type CommandParseResult = {
  success: boolean;
  parsedCommand?: ParsedCommand;
  suggestedAlternatives?: string[];
  commandActions?: CommandAction[];
  clarificationNeeded?: boolean;
  clarificationQuestion?: string;
};

export interface CommandParserProps {
  onCommandExecuted?: (result: CommandParseResult) => void;
  onClarificationNeeded?: (question: string, originalCommand: string) => void;
}
