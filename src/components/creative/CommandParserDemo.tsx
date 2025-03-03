
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CommandParser } from './CommandParser';
import { CommandParseResult, Command } from './CommandParser/types';
import { CommandHistoryItem } from './CommandParserDemo/types';
import { getResultColor } from './CommandParserDemo/utils';
import CurrentResult from './CommandParserDemo/CurrentResult';
import CommandHistory from './CommandParserDemo/CommandHistory';
import Documentation from './CommandParserDemo/Documentation';

const CommandParserDemo = () => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<CommandParseResult | null>(null);

  const handleCommandParsed = (result: CommandParseResult) => {
    setCurrentResult(result);
    
    // Add to history if there's a command
    if (result.command) {
      setHistory(prev => [
        {
          input: result.command?.originalText || '',
          result,
          timestamp: new Date()
        },
        ...prev
      ]);
    }
    
    // In a real application, you would dispatch actions based on the command
    console.log('Command parsed:', result);
  };

  const handleClarificationNeeded = (question: string, originalCommand: string) => {
    // In a real app, you might show a dialog or provide feedback to the user
    setCurrentResult({
      success: false,
      needsClarification: true,
      clarificationQuestion: question,
      command: {
        domain: 'unknown',
        action: 'clarify',
        parameters: {},
        originalText: originalCommand
      },
      confidence: 0,
      rawInput: originalCommand
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Command Parser Demo</h2>
      
      <Card className="p-4 mb-6">
        <h3 className="text-lg font-medium mb-4">Enter a Command</h3>
        <p className="text-sm text-gray-500 mb-4">
          Try commands like "draw a red circle", "change the font to Arial", "animate the logo with a fade in",
          or "create a new section for the homepage"
        </p>
        
        <CommandParser 
          instruction="What would you like to do?"
          onParsed={handleCommandParsed}
          onClarificationNeeded={handleClarificationNeeded}
          requireConfirmation={true}
          confidenceThreshold={0.4}
        />
        
        <CurrentResult
          currentResult={currentResult}
          getResultColor={getResultColor}
        />
      </Card>
      
      <CommandHistory 
        history={history}
        getResultColor={getResultColor}
      />
      
      <Documentation />
    </div>
  );
};

export default CommandParserDemo;
