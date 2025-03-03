import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CommandParser } from './CommandParser';
import { CommandParseResult } from './CommandParser/types';
import { IntentType } from './CommandParser/intentClassifier';

interface CommandHistoryItem {
  input: string;
  result: CommandParseResult;
  timestamp: Date;
}

const CommandParserDemo = () => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [currentResult, setCurrentResult] = useState<CommandParseResult | null>(null);

  const handleCommandParsed = (result: CommandParseResult) => {
    setCurrentResult(result);
    
    // Add to history if there's a command
    if (result.command) {
      setHistory(prev => [
        {
          input: result.command?.originalCommand || '',
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
        subject: 'input',
        parameters: {},
        originalCommand
      }
    });
  };

  const getResultColor = (result: CommandParseResult) => {
    if (!result.success) return 'bg-red-500/10 border-red-500/30';
    if (result.needsClarification) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-green-500/10 border-green-500/30';
  };

  const getIntentIcon = (intent: IntentType | undefined) => {
    if (!intent) return '❓';
    
    // Map intents to emoji icons
    const intentMap: Record<string, string> = {
      'draw.shape': '⭕',
      'draw.line': '➖',
      'draw.erase': '🧹',
      'draw.fill': '🎨',
      'style.changeColor': '🌈',
      'style.changeFont': '📝',
      'style.changeSpacing': '↔️',
      'style.applyTheme': '🎭',
      'animate.fadeIn': '✨',
      'animate.fadeOut': '🌫️',
      'animate.move': '➡️',
      'animate.rotate': '🔄',
      'website.preview': '👁️',
      'website.addSection': '➕',
      'website.editElement': '✏️',
      'website.exportCode': '💾',
      'transform.imageToAnimation': '🎞️',
      'transform.drawingToCode': '📊',
      'transform.styleExtraction': '🎯',
      'conversation': '💬',
      'unknown': '❓'
    };
    
    return intentMap[intent] || '❓';
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
        
        {currentResult && (
          <div className={`mt-4 p-3 border rounded-md text-sm ${getResultColor(currentResult)}`}>
            {currentResult.success ? (
              <>
                <div className="font-medium">Command Parsed Successfully:</div>
                <div className="mt-1">
                  {currentResult.command?.action} {currentResult.command?.subject}
                  {currentResult.command?.parameters && Object.keys(currentResult.command.parameters).length > 0 && (
                    <div className="mt-1">
                      <span className="font-medium">Parameters:</span>
                      <pre className="text-xs mt-1 p-2 bg-black/20 rounded overflow-x-auto">
                        {JSON.stringify(currentResult.command.parameters, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                {currentResult.command?.intent && (
                  <div className="mt-2 text-xs flex items-center">
                    <span className="mr-2">Detected Intent:</span>
                    <span className="bg-blue-500/20 px-2 py-1 rounded-full font-mono">
                      {getIntentIcon(currentResult.command.intent)} {currentResult.command.intent}
                    </span>
                  </div>
                )}
                {currentResult.command?.confidence !== undefined && (
                  <div className="mt-1 text-xs">
                    Confidence: {Math.round((currentResult.command.confidence || 0) * 100)}%
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="font-medium">
                  {currentResult.needsClarification ? "Clarification Needed:" : "Parsing Error:"}
                </div>
                <div className="mt-1">
                  {currentResult.clarificationQuestion || currentResult.error || 'Unknown error'}
                </div>
              </>
            )}
          </div>
        )}
      </Card>
      
      {history.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Command History</h3>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={index} 
                className={`p-3 border rounded-md text-sm ${getResultColor(item.result)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium flex items-center">
                    {item.result.command?.intent && (
                      <span className="mr-2">{getIntentIcon(item.result.command.intent)}</span>
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
            ))}
          </div>
        </Card>
      )}
      
      <Alert className="mt-6">
        <AlertTitle>Command Parser Documentation</AlertTitle>
        <AlertDescription>
          <p className="mb-2">The enhanced Command Parser system supports the following features:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Natural language command parsing</li>
            <li>Intent classification with confidence scores</li>
            <li>Parameter extraction (colors, sizes, shapes, etc.)</li>
            <li>Domain detection (drawing, styling, animation, etc.)</li>
            <li>Confirmation with command preview</li>
            <li>Clarification requests for ambiguous commands</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default CommandParserDemo;