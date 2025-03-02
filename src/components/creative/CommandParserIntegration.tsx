
import React, { useState } from "react";
import { CommandParser } from "./CommandParser";
import { CommandParseResult } from "./CommandParser/types";
import { Toaster } from "sonner";
import { useCreative } from "./CreativeContext";

const CommandParserIntegration: React.FC = () => {
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [originalCommand, setOriginalCommand] = useState<string | null>(null);
  const creativeContext = useCreative();

  // Handle successful command execution
  const handleCommandExecuted = (result: CommandParseResult) => {
    console.log("Command executed:", result);
    
    // Update creative context state based on the command
    if (result.parsedCommand && result.commandActions) {
      // In a real implementation, we would update the creative context based on the command
      // For example, adding assets, updating assets, etc.
      
      // Clear any pending clarification
      setClarificationQuestion(null);
      setOriginalCommand(null);
    }
  };

  // Handle clarification needed
  const handleClarificationNeeded = (question: string, command: string) => {
    setClarificationQuestion(question);
    setOriginalCommand(command);
    
    // In a real implementation, we might want to provide UI feedback or suggestions
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-medium text-white mb-3">Command Interpreter</h3>
      <CommandParser
        onCommandExecuted={handleCommandExecuted}
        onClarificationNeeded={handleClarificationNeeded}
      />
      {clarificationQuestion && (
        <div className="mt-3 p-3 bg-blue-900/20 border border-blue-800/30 rounded-lg text-sm text-blue-200">
          <p>{clarificationQuestion}</p>
          {originalCommand && (
            <p className="mt-1 text-xs text-blue-300">Original command: "{originalCommand}"</p>
          )}
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default CommandParserIntegration;
