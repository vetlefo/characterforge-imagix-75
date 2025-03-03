
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";

interface MessageInputProps {
  onSubmit: (message: string) => void;
  onSuggestionRequest: () => void;
  placeholder?: string;
  isProcessing?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSubmit,
  onSuggestionRequest,
  placeholder = "Type a message or creative instruction...",
  isProcessing
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue.trim() || isProcessing) return;
    onSubmit(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[60px] flex-1 resize-none"
      />
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !inputValue.trim()}
          variant="default"
          size="icon"
          className="h-[30px] w-[30px]"
        >
          <Send size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-[30px] w-[30px]"
          onClick={onSuggestionRequest}
        >
          <Sparkles size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
