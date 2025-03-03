
import { useState } from "react";
import CommandParser from "./CommandParser/CommandParser";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { CommandParseResult } from "./CommandParser/types";

interface CommandParserIntegrationProps {
  onExecuteCommand?: (command: any) => void;
  showExamples?: boolean;
  className?: string;
}

const CommandParserIntegration = ({
  onExecuteCommand,
  showExamples = true,
  className
}: CommandParserIntegrationProps) => {
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);
  const [originalCommand, setOriginalCommand] = useState<string>("");
  
  const handleCommandParsed = (result: CommandParseResult) => {
    if (result.success && result.command) {
      console.log("Command successfully parsed:", result.command);
      if (onExecuteCommand) {
        onExecuteCommand(result.command);
      }
    } else {
      console.log("Command parsing failed:", result.error);
    }
  };
  
  const handleClarificationNeeded = (question: string, command: string) => {
    setClarificationQuestion(question);
    setOriginalCommand(command);
  };
  
  const examples = [
    "Create a red circle",
    "Apply blue gradient to background",
    "Generate animation for logo",
    "Extract color palette from image",
    "Save current project as portfolio"
  ];
  
  return (
    <div className={className}>
      <CommandParser
        instruction="What would you like to create?"
        onParsed={handleCommandParsed}
        onClarificationNeeded={handleClarificationNeeded}
      />
      
      {clarificationQuestion && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md">
          <p className="flex items-center gap-2 text-sm">
            <HelpCircle size={16} className="text-blue-400" />
            <span>{clarificationQuestion}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Original: "{originalCommand}"</p>
        </div>
      )}
      
      {showExamples && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                className="text-xs bg-[#1A1A2E]/40"
                onClick={() => {
                  const inputElement = document.querySelector('input');
                  if (inputElement) {
                    // Create a new input event
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    )?.set;
                    
                    if (nativeInputValueSetter) {
                      nativeInputValueSetter.call(inputElement, example);
                      const event = new Event('input', { bubbles: true });
                      inputElement.dispatchEvent(event);
                    }
                  }
                }}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandParserIntegration;
