
import React from 'react';
import { CommandHistoryItem as CommandHistoryItemType } from './types';
import IntentIcon from './IntentIcon';

interface CommandHistoryItemProps {
  item: CommandHistoryItemType;
  getResultColor: (result: CommandHistoryItemType['result']) => string;
}

const CommandHistoryItem: React.FC<CommandHistoryItemProps> = ({ item, getResultColor }) => {
  return (
    <div className={`p-3 border rounded-md text-sm ${getResultColor(item.result)}`}>
      <div className="flex justify-between items-start">
        <div className="font-medium flex items-center">
          {item.result.command?.intent && (
            <span className="mr-2"><IntentIcon intent={item.result.command.intent.type} /></span>
          )}
          <span>{item.input}</span>
        </div>
        <div className="text-xs text-gray-500">
          {item.timestamp.toLocaleTimeString()}
        </div>
      </div>
      <div className="mt-1 text-sm">
        {item.result.success ? (
          <span className="text-green-500">
            {item.result.command?.action} {item.result.command?.subject}
          </span>
        ) : (
          <span className="text-red-500">
            {item.result.error || 'Failed to parse'}
          </span>
        )}
      </div>
    </div>
  );
};

export default CommandHistoryItem;
