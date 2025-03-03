import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card } from '../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { classifyIntent } from './intentClassifier';
import { Command, CommandParserProps, CommandParseResult } from './types';

const CommandParser = ({
  instruction,
  onParsed,
  onClarificationNeeded,
  requireConfirmation = false,
  allowedDomains,
  className = ""
}: CommandParserProps) => {
  const [command, setCommand] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [parsedCommand, setParsedCommand] = useState<Command | null>(null);
  
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };
  
  const parseCommand = async () => {
    if (!command.trim()) return;
    
    setIsParsing(true);
    
    try {
      // Use intent classifier to determine domain and intent
      const intent = await classifyIntent(command);
      
      // Check if domain is allowed (if specified)
      if (allowedDomains && !allowedDomains.includes(intent.domain)) {
        onClarificationNeeded(
          `I can only handle commands related to ${allowedDomains.join(', ')}. Could you rephrase your command?`,
          command
        );
        setIsParsing(false);
        return;
      }
      
      // Create the parsed command
      const parsedCommand: Command = {
        originalText: command,
        domain: intent.domain,
        action: intent.type.split('.')[1] || '',
        parameters: intent.parameters,
        intent: intent
      };
      
      setParsedCommand(parsedCommand);
      
      // If confirmation is required, show confirmation UI
      if (requireConfirmation) {
        setNeedsConfirmation(true);
      } else {
        // Otherwise, immediately process the command
        handleConfirm();
      }
    } catch (error) {
      console.error('Error parsing command:', error);
      onClarificationNeeded('I had trouble understanding that command. Could you rephrase it?', command);
    } finally {
      setIsParsing(false);
    }
  };
  
  const handleConfirm = () => {
    if (!parsedCommand) return;
    
    // Create the result object with the intent
    const result: CommandParseResult = {
      command: parsedCommand,
      confidence: parsedCommand.intent?.confidence || 0,
      rawInput: command
    };
    
    // Reset state
    setCommand('');
    setParsedCommand(null);
    setNeedsConfirmation(false);
    
    // Call the onParsed callback with the result
    onParsed(result);
  };
  
  const handleCancel = () => {
    setParsedCommand(null);
    setNeedsConfirmation(false);
  };
  
  return (
    <div className={`command-parser ${className}`}>
      <p className="text-sm text-muted-foreground mb-2">{instruction}</p>
      
      {needsConfirmation && parsedCommand && (
        <Card className="p-4 mb-4">
          <Alert className="mb-4">
            <AlertTitle>Confirm Action</AlertTitle>
            <AlertDescription>
              I'll {parsedCommand.action} in the {parsedCommand.domain} domain with these parameters: 
              {Object.entries(parsedCommand.parameters || {}).map(([key, value]) => (
                <span key={key} className="block ml-2">
                  {key}: <code>{JSON.stringify(value)}</code>
                </span>
              ))}
              <div className="mt-2">Confidence: {(parsedCommand.intent?.confidence || 0) * 100}%</div>
            </AlertDescription>
          </Alert>
          
          <div className="flex space-x-2">
            <Button onClick={handleConfirm}>Confirm</Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </Card>
      )}
      
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type your command here..."
          value={command}
          onChange={handleCommandChange}
          onKeyDown={(e) => e.key === 'Enter' && parseCommand()}
          className="flex-1"
          disabled={isParsing}
        />
        <Button 
          onClick={parseCommand}
          disabled={!command.trim() || isParsing}
        >
          {isParsing ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default CommandParser;
