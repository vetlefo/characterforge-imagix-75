
import React, { useState, useRef, useEffect } from "react";
import { parseCommand, executeCommandActions } from "./commandParserUtils";
import { CommandParserProps, CommandParseResult } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SendIcon, ZapIcon, X } from "lucide-react";
import { useCreative } from "../CreativeContext";
import { useToast } from "@/hooks/use-toast";

const CommandParser: React.FC<CommandParserProps> = ({
  onCommandExecuted,
  onClarificationNeeded
}) => {
  const [command, setCommand] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<CommandParseResult | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const creativeContext = useCreative();
  const { toast } = useToast();

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setIsProcessing(true);
    
    // Parse the command
    const result = parseCommand(command);
    setParseResult(result);
    
    if (result.success) {
      // Execute the command if parsing was successful
      if (result.commandActions && result.commandActions.length > 0) {
        const success = executeCommandActions(result.commandActions, creativeContext);
        
        if (success && onCommandExecuted) {
          onCommandExecuted(result);
        }
        
        // Reset command input after successful execution
        setCommand("");
        setParseResult(null);
      }
    } else if (result.clarificationNeeded && result.clarificationQuestion) {
      // Show the clarification UI
      setShowSuggestions(true);
      
      // Notify parent component if needed
      if (onClarificationNeeded) {
        onClarificationNeeded(result.clarificationQuestion, command);
      }
    }
    
    setIsProcessing(false);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    
    // Auto-submit the suggestion
    setTimeout(() => {
      if (textareaRef.current) {
        const form = textareaRef.current.form;
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    }, 100);
  };

  // Handle clarification dismissal
  const handleDismissClarification = () => {
    setShowSuggestions(false);
    setParseResult(null);
    
    // Focus back on the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full bg-[#1A1A2E]/40 rounded-xl border border-[#2A2A4A]/30 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter a creative command (e.g., 'Create a red circle' or 'Add some text')"
            className="min-h-20 bg-[#252547]/50 border border-[#3A3A5A]/50 text-white resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={isProcessing || !command.trim()}
            className="absolute bottom-2 right-2 bg-blue-600/80 hover:bg-blue-600 h-8 w-8 p-0"
            aria-label="Send command"
          >
            <SendIcon size={16} />
          </Button>
        </div>
        
        {showSuggestions && parseResult && (
          <div className="p-4 bg-[#2A2A4A]/70 rounded-lg border border-[#3A3A5A]/50 relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={handleDismissClarification}
              aria-label="Dismiss"
            >
              <X size={14} />
            </Button>
            
            <div className="text-white mb-3">
              {parseResult.clarificationQuestion || "Did you mean one of these?"}
            </div>
            
            {parseResult.suggestedAlternatives && parseResult.suggestedAlternatives.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {parseResult.suggestedAlternatives.map((suggestion, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="bg-[#3A3A6A]/50 border-blue-500/30 text-blue-200 hover:bg-[#3A3A6A] hover:text-blue-100"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <ZapIcon size={14} className="mr-1" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default CommandParser;
