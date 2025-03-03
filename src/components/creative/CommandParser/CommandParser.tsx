
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Command, CommandParserProps } from "./types";
import { parseInstruction, describeCommand, getSuggestionForCommand } from "./commandParserUtils";
import { classifyCommand } from "./domains";

const CommandParser: React.FC<CommandParserProps> = ({
  instruction,
  onParsed,
  allowedDomains,
  requireConfirmation = false,
  className
}) => {
  const [parsedCommand, setParsedCommand] = useState<Command | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [userResponse, setUserResponse] = useState<string>("");
  
  // Parse the instruction whenever it changes
  useEffect(() => {
    if (!instruction || instruction.trim() === "") {
      setParsedCommand(null);
      setShowConfirmation(false);
      setSuggestion("");
      return;
    }
    
    // Parse the instruction
    const command = parseInstruction(instruction);
    
    // Check if the command's domain is allowed
    if (allowedDomains && allowedDomains.length > 0) {
      if (!allowedDomains.includes(command.domain)) {
        // Domain not allowed, create a fallback command
        const fallbackDomain = allowedDomains[0];
        const fallbackCommand = {
          ...command,
          domain: fallbackDomain,
          confidence: 0.5,
          requiresConfirmation: true
        };
        setParsedCommand(fallbackCommand);
        setSuggestion(`I understand this as a ${command.domain} command, but I can only handle ${allowedDomains.join(", ")} commands.`);
        setShowConfirmation(true);
        return;
      }
    }
    
    setParsedCommand(command);
    
    // Determine if we need to show confirmation
    const needsConfirmation = requireConfirmation || command.requiresConfirmation;
    setShowConfirmation(needsConfirmation);
    
    if (needsConfirmation) {
      setSuggestion(getSuggestionForCommand(command));
    } else if (onParsed) {
      // Auto-execute if confident and no confirmation required
      onParsed(command);
    }
  }, [instruction, allowedDomains, requireConfirmation, onParsed]);
  
  const handleConfirm = () => {
    if (parsedCommand && onParsed) {
      const confirmedCommand: Command = {
        ...parsedCommand,
        confirmed: true
      };
      onParsed(confirmedCommand);
      setShowConfirmation(false);
    }
  };
  
  const handleCancel = () => {
    setParsedCommand(null);
    setShowConfirmation(false);
    setSuggestion("");
  };
  
  const handleUserResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userResponse.trim()) return;
    
    // Replace original instruction with user's clarification
    const updatedCommand = parseInstruction(userResponse);
    setParsedCommand(updatedCommand);
    
    // Clear user response input
    setUserResponse("");
    
    // If confidence is now high, execute
    if (updatedCommand.confidence > 0.7) {
      setShowConfirmation(false);
      if (onParsed) {
        onParsed(updatedCommand);
      }
    } else {
      // Still needs confirmation
      setSuggestion(getSuggestionForCommand(updatedCommand));
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Original instruction display */}
      {instruction && parsedCommand && (
        <div className="text-sm">
          <div className="font-medium mb-1">I understood your request as:</div>
          <div className="bg-muted p-2 rounded-md">
            <pre className="text-xs whitespace-pre-wrap">
              {describeCommand(parsedCommand)}
            </pre>
          </div>
        </div>
      )}
      
      {/* Confirmation UI */}
      {showConfirmation && (
        <Alert className="border-blue-500 bg-blue-500/10">
          <AlertDescription>
            {suggestion}
            <div className="flex space-x-2 mt-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleConfirm}
              >
                Yes, that's correct
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                No, cancel
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Clarification input */}
      {showConfirmation && (
        <form onSubmit={handleUserResponseSubmit} className="flex gap-2">
          <Input
            placeholder="Clarify your instruction..."
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Update</Button>
        </form>
      )}
    </div>
  );
};

export default CommandParser;
