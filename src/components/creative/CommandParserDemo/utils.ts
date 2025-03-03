
import { CommandParseResult } from '../CommandParser/types';

export const getResultColor = (result: CommandParseResult): string => {
  if (!result.success) return 'bg-red-500/10 border-red-500/30';
  if (result.needsClarification) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-green-500/10 border-green-500/30';
};
