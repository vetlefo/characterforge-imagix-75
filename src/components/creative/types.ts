
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
  conversationHistory: ConversationMessage[];
  creativeIntent?: string;
}

export type AssetUpdateData = Partial<Omit<Asset, "id" | "createdAt">>;

export interface MessageContent {
  type: "text" | "image" | "code" | "slider" | "button";
  content: string;
  language?: string;
  src?: string;
  alt?: string;
  caption?: string;
  min?: number;
  max?: number;
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  label?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export interface ConversationMessage {
  id?: string;
  sender: string;
  content: MessageContent | MessageContent[];
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
