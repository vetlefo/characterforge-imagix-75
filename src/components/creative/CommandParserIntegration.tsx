
import React, { useState } from 'react';
import { CommandParser } from './CommandParser';
import { Command, CommandParseResult, CommandParserIntegrationProps, DomainHandler } from './CommandParser/types';
import { useToast } from '../../hooks/use-toast';

const CommandParserIntegration: React.FC<CommandParserIntegrationProps> = ({
  onExecuteCommand,
  allowedDomains,
  instruction = "What would you like to create?"
}) => {
  const { toast } = useToast();
  const [lastCommand, setLastCommand] = useState<Command | null>(null);
  
  // Domain handlers for different creative domains
  const domainHandlers: Record<string, DomainHandler> = {
    drawing: {
      execute: (command) => {
        toast({
          title: "Drawing Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'drawing'
    },
    
    styling: {
      execute: (command) => {
        toast({
          title: "Styling Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'styling'
    },
    
    animation: {
      execute: (command) => {
        toast({
          title: "Animation Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'animation'
    },
    
    website: {
      execute: (command) => {
        toast({
          title: "Website Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'website'
    },
    
    media: {
      execute: (command) => {
        toast({
          title: "Media Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'media'
    },
    
    general: {
      execute: (command) => {
        toast({
          title: "General Command",
          description: `Action: ${command.action}, Parameters: ${JSON.stringify(command.parameters)}`,
        });
        
        if (onExecuteCommand) {
          onExecuteCommand(command);
        }
      },
      canHandle: (command) => command.domain === 'general'
    }
  };
  
  const handleParsedCommand = (result: CommandParseResult) => {
    const { command } = result;
    setLastCommand(command);
    
    // Find the appropriate handler for the command's domain
    const handler = Object.values(domainHandlers).find(h => h.canHandle(command));
    
    if (handler) {
      handler.execute(command);
    } else {
      toast({
        title: "Unknown Command Domain",
        description: `I'm not sure how to handle ${command.domain} commands yet.`,
        variant: "destructive"
      });
    }
  };
  
  const handleClarificationNeeded = (question: string, originalCommand: string) => {
    toast({
      title: "I need clarification",
      description: question,
    });
  };
  
  return (
    <div className="command-parser-integration">
      <CommandParser
        instruction={instruction}
        onParsed={handleParsedCommand}
        onClarificationNeeded={handleClarificationNeeded}
        allowedDomains={allowedDomains}
      />
      
      {lastCommand && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-medium">Last Executed Command</h3>
          <p><strong>Domain:</strong> {lastCommand.domain}</p>
          <p><strong>Action:</strong> {lastCommand.action}</p>
          <p><strong>Parameters:</strong></p>
          <pre className="bg-gray-100 p-2 rounded">
            {JSON.stringify(lastCommand.parameters, null, 2)}
          </pre>
          <p><strong>Confidence:</strong> {(lastCommand.intent?.confidence || 0) * 100}%</p>
        </div>
      )}
    </div>
  );
};

export default CommandParserIntegration;
