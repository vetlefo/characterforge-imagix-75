
import React from 'react';
import { Card } from '@/components/ui/card';
import { CommandHistoryItem as CommandHistoryItemType } from './types';
import CommandHistoryItem from './CommandHistoryItem';

interface CommandHistoryProps {
  history: CommandHistoryItemType[];
  getResultColor: (result: CommandHistoryItemType['result']) => string;
}

const CommandHistory: React.FC<CommandHistoryProps> = ({ history, getResultColor }) => {
  if (history.length === 0) return null;
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Command History</h3>
      <div className="space-y-3">
        {history.map((item, index) => (
          <CommandHistoryItem 
            key={index} 
            item={item} 
            getResultColor={getResultColor} 
          />
        ))}
      </div>
    </Card>
  );
};

export default CommandHistory;
