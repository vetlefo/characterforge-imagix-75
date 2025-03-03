
import React, { useState } from 'react';
import { CommandParser } from './CommandParser';
import { CommandParseResult } from './CommandParser/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CommandParserIntegration: React.FC = () => {
  const [command, setCommand] = useState<string>('');
  const [result, setResult] = useState<CommandParseResult | null>(null);
  const [clarification, setClarification] = useState<string | null>(null);
  
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset states
    setResult(null);
    setClarification(null);
  };
  
  const handleCommandExecuted = (parseResult: CommandParseResult) => {
    setResult(parseResult);
    setClarification(null);
  };
  
  const handleClarificationNeeded = (question: string, originalCommand: string) => {
    setClarification(question);
    setResult(null);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Command Parser</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommandSubmit} className="flex gap-2">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter a creative command..."
              className="flex-1"
            />
            <Button type="submit">Execute</Button>
          </form>
          
          {command && (
            <CommandParser 
              instruction={command} 
              onParsed={handleCommandExecuted}
              onClarificationNeeded={handleClarificationNeeded}
            />
          )}
          
          {clarification && (
            <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-200 rounded-md">
              <p className="font-medium">Clarification needed:</p>
              <p>{clarification}</p>
            </div>
          )}
          
          {result && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-green-500/20 text-green-200 rounded-md">
                <p className="font-medium">Command Parsed Successfully</p>
                <p>Domain: {result.domain}</p>
                <p>Action: {result.action}</p>
                <p>Subject: {result.subject}</p>
                <pre className="mt-2 p-2 bg-black/50 rounded overflow-x-auto">
                  {JSON.stringify(result.parameters, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandParserIntegration;
