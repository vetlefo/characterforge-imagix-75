import React, { useState, useRef, useEffect } from "react";
import { useCreative } from "./CreativeContext";
import { CommandParser } from "./CommandParser";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { MessageContent, ConversationMessage, Action } from "./types";
import { CommandParseResult } from "./CommandParser/types";
import { cn } from "@/lib/utils";
import { ConversationMessage as ConversationMessageComponent } from "./ConversationMessage";

interface ConversationalInterfaceProps {
  className?: string;
  initialMessage?: string;
  placeholder?: string;
  showCommandParser?: boolean;
  allowedDomains?: string[];
}

/**
 * Enhanced Conversational Interface component that integrates with CreativeContext
 * and CommandParser to provide a unified input interface for the creative platform.
 */
export const ConversationalInterface: React.FC<ConversationalInterfaceProps> = ({
  className,
  initialMessage = "How can I help with your creative project today?",
  placeholder = "Type a message or creative instruction...",
  showCommandParser = true,
  allowedDomains = ["drawing", "animation", "styling", "website", "transform", "creative", "general"]
}) => {
  const { 
    conversationHistory, 
    addConversationMessage, 
    executeCreativeAction, 
    suggestRelevantAssets,
    analyzeCreativeIntent,
    creativeIntent
  } = useCreative();
  
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when conversation history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory]);
  
  // Add initial system message if conversation is empty
  useEffect(() => {
    if (conversationHistory.length === 0 && initialMessage) {
      addConversationMessage({
        sender: "assistant",
        content: {
          type: "text",
          content: initialMessage
        }
      });
    }
  }, [conversationHistory.length, initialMessage, addConversationMessage]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message to conversation
    addConversationMessage({
      sender: "user",
      content: {
        type: "text",
        content: inputValue
      }
    });
    
    // Clear input and set processing state
    setInputValue("");
    setIsProcessing(true);
    
    try {
      // Analyze message for creative intent
      analyzeCreativeIntent(inputValue);
      
      // In a real implementation, this would generate a response from an AI
      // or other service based on the input and creative intent
      
      // For now, we'll just simulate a response after a short delay
      setTimeout(() => {
        const responseContent: MessageContent = {
          type: "text",
          content: generateSimpleResponse(inputValue)
        };
        
        // Generate some actions based on potential intents
        const actions: Action[] = generatePotentialActions(inputValue);
        
        // Add assistant message to conversation
        addConversationMessage({
          sender: "assistant",
          content: responseContent,
          actions: actions.length > 0 ? actions : undefined
        });
        
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message to conversation
      addConversationMessage({
        sender: "system",
        content: {
          type: "text",
          content: "Sorry, there was an error processing your message."
        }
      });
      
      setIsProcessing(false);
    }
  };
  
  const handleCommandParsed = (result: CommandParseResult) => {
    if (result.success && result.command) {
      // Add command confirmation to conversation
      addConversationMessage({
        sender: "system",
        content: {
          type: "text",
          content: `Command parsed: ${result.command.action} ${result.command.subject}`
        },
        metadata: {
          command: result.command
        }
      });
      
      // Execute the command
      executeCreativeAction(
        `${result.command.domain}.${result.command.action}`, 
        result.command.parameters
      );
    } else {
      // Add error message to conversation
      addConversationMessage({
        sender: "system",
        content: {
          type: "text",
          content: result.error || "Could not understand that command."
        }
      });
    }
  };
  
  const handleClarificationNeeded = (question: string, originalCommand: string) => {
    // Add clarification request to conversation
    addConversationMessage({
      sender: "assistant",
      content: {
        type: "text",
        content: question
      },
      metadata: {
        originalCommand
      }
    });
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleActionClick = (action: Action) => {
    console.log("Action clicked:", action);
    executeCreativeAction(action.type, action.payload);
    
    // Add action confirmation to conversation
    addConversationMessage({
      sender: "system",
      content: {
        type: "text",
        content: `Executing action: ${action.label}`
      },
      metadata: {
        action
      }
    });
  };
  
  // Simple placeholder response generator
  const generateSimpleResponse = (input: string): string => {
    if (input.toLowerCase().includes("draw")) {
      return "I can help you with drawing. What would you like to create?";
    } else if (input.toLowerCase().includes("animate") || input.toLowerCase().includes("animation")) {
      return "Animation is a great way to bring your content to life. What kind of animation are you thinking about?";
    } else if (input.toLowerCase().includes("style") || input.toLowerCase().includes("color")) {
      return "Let's talk about styling. Would you like to change colors, typography, or spacing?";
    } else if (input.toLowerCase().includes("website")) {
      return "I can help you with website design and preview. What kind of website are you creating?";
    } else {
      return "I'm here to help with your creative project. You can ask me about drawing, animation, styling, or website creation.";
    }
  };
  
  // Generate some potential actions based on user input
  const generatePotentialActions = (input: string): Action[] => {
    const actions: Action[] = [];
    
    if (input.toLowerCase().includes("draw")) {
      actions.push({
        type: "drawing.open",
        label: "Open Drawing Canvas",
        payload: {}
      });
    }
    
    if (input.toLowerCase().includes("animate") || input.toLowerCase().includes("animation")) {
      actions.push({
        type: "animation.open",
        label: "Open Animation Editor",
        payload: {}
      });
    }
    
    if (input.toLowerCase().includes("style") || input.toLowerCase().includes("color")) {
      actions.push({
        type: "style.open",
        label: "Open Style System",
        payload: {}
      });
    }
    
    if (input.toLowerCase().includes("website")) {
      actions.push({
        type: "website.open",
        label: "Open Website Preview",
        payload: {}
      });
    }
    
    return actions;
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory?.map((message) => (
          <ConversationMessageComponent
            key={message.id}
            id={message.id}
            sender={message.sender as "user" | "assistant"}
            content={Array.isArray(message.content) 
              ? message.content.map(c => ({
                  type: c.type,
                  content: c.content,
                }))
              : {
                  type: message.content.type,
                  content: message.content.content,
                }
            }
            timestamp={message.timestamp}
            visualIndicator={
              message.sender === "system" 
                ? message.metadata?.command 
                  ? "info" 
                  : message.metadata?.action 
                    ? "success" 
                    : undefined
                : undefined
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <Card className="border-t rounded-t-none p-4">
        {showCommandParser ? (
          <CommandParser
            instruction="Enter a creative command..."
            onParsed={handleCommandParsed}
            onClarificationNeeded={handleClarificationNeeded}
            allowedDomains={allowedDomains as any}
            confidenceThreshold={0.4}
            className="mb-4"
          />
        ) : null}
        
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
              onClick={handleSendMessage}
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
              onClick={() => {
                // Trigger suggestions
                console.log("Suggestion triggered");
              }}
            >
              <Sparkles size={16} />
            </Button>
          </div>
        </div>
        {isProcessing && <div className="text-xs text-muted-foreground mt-2">Processing...</div>}
      </Card>
    </div>
  );
};

export default ConversationalInterface;
