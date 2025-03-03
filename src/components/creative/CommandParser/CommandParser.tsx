
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseCommand } from "./commandParserUtils";
import { Command, CommandDomain, CommandParseResult, CommandParserProps } from "./types";

export const CommandParser = ({
  instruction,
  onParsed,
  allowedDomains = ["drawing", "animation", "style", "website", "transform", "creative", "general"],
  requireConfirmation = true,
  className,
  onClarificationNeeded
}: CommandParserProps) => {
  const [inputValue, setInputValue] = useState("");
  const [parsedCommand, setParsedCommand] = useState<Command | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Reset confirmation state when input changes
    if (needsConfirmation) {
      setNeedsConfirmation(false);
      setParsedCommand(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (needsConfirmation && parsedCommand) {
      // User is confirming a command
      onParsed({ 
        success: true, 
        command: { ...parsedCommand, confirmed: true } 
      });
      
      // Reset state
      setInputValue("");
      setParsedCommand(null);
      setNeedsConfirmation(false);
      return;
    }
    
    // Parse the command
    const result = parseCommand(inputValue, allowedDomains as CommandDomain[]);
    
    if (result.needsClarification && onClarificationNeeded) {
      onClarificationNeeded(result.clarificationQuestion || "Could you clarify?", inputValue);
      setInputValue("");
      return;
    }
    
    if (result.success && result.command) {
      if (requireConfirmation && result.command.requiresConfirmation) {
        // Store command and request confirmation
        setParsedCommand(result.command);
        setNeedsConfirmation(true);
      } else {
        // No confirmation needed, pass directly
        onParsed(result);
        setInputValue("");
      }
    } else {
      // Pass error to parent
      onParsed(result);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={needsConfirmation ? "Confirm or modify..." : instruction || "Enter a command..."}
          className={cn(
            "flex-1 bg-[#0A0A1B] border-[#1A1A2E]",
            needsConfirmation && "border-blue-500"
          )}
        />
        <Button 
          type="submit" 
          size="icon"
          variant={needsConfirmation ? "default" : "outline"}
          className={cn(
            "rounded-full",
            needsConfirmation && "bg-blue-500 hover:bg-blue-600"
          )}
        >
          {needsConfirmation ? <ArrowRight size={16} /> : <Send size={16} />}
        </Button>
      </form>
      
      {needsConfirmation && parsedCommand && (
        <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md text-sm">
          <p className="font-medium">Confirm action:</p>
          <p>
            {parsedCommand.action} {parsedCommand.subject}
            {Object.keys(parsedCommand.parameters).length > 0 && 
              ` with ${Object.keys(parsedCommand.parameters).join(", ")}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default CommandParser;
