export interface Asset {
  id: string;
  type: "image" | "text" | "website" | "other";
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  relationships: Relationship[];
  metadata: Record<string, any>;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: "inspiration" | "iteration" | "component" | "reference";
  strength: number; // 1-10
  createdAt: Date;
  metadata: Record<string, any>;
}

export interface CreativeContextState {
  activeDrawing: boolean;
  currentIntent: string;
  suggestionsVisible: boolean;
  lastPrompt: string;
  assets: Asset[];
  selectedAssetId: string | null;
}

export type AssetUpdateData = Partial<Omit<Asset, "id" | "createdAt">>;

export interface CommandParseResult {
  domain: string;
  action: string;
  subject: string;
  parameters: Record<string, any>;
  originalCommand: string;
}

export interface CommandParserProps {
  instruction: string;
  onParsed?: (result: CommandParseResult) => void;
  onClarificationNeeded?: (question: string, command: string) => void;
}
