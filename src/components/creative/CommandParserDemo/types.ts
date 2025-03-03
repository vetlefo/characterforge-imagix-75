
import { CommandParseResult } from '../CommandParser/types';

export interface CommandHistoryItem {
  input: string;
  result: CommandParseResult;
  timestamp: Date;
}

export interface IntentIconProps {
  intent: string | undefined;
}
