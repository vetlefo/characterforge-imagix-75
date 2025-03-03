
import React, { useState, useEffect } from "react";
import { useCreative } from "../CreativeContext";
import { CommandParser } from "../CommandParser";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConversationalInterfaceProps } from "./types";
import { generateSimpleResponse, generatePotentialActions } from "./utils";
import { CommandParseResult } from "../CommandParser/types";
import { ConversationMessage, Action, MessageContent } from "../types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { v4 as uuidv4 } from "uuid";

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
    addAsset, 
    setCurrentIntent,
    executeCreativeAction = (action: string, payload: any) => console.log(`Executing action: ${action}`, payload),
    assets,
    suggestionsVisible = false,
    setSuggestionsVisible = () => {},
    analyzeCreativeIntent = (input: string) => setCurrentIntent(input),
  } = useCreative();
  
  // Create local state to manage conversation since CreativeContext doesn't fully support it yet
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add local implementation of addConversationMessage for now
  const addConversationMessage = (message: ConversationMessage) => {
    const messageWithId = {
      ...message,
      id: message.id || uuidv4(),
      timestamp: message.timestamp || new Date()
    };
    setConversationHistory(prev => [...prev, messageWithId]);
    
    // Also store as an asset if it's from user or assistant (not system)
    if (message.sender === 'user' || message.sender === 'assistant') {
      const content = Array.isArray(message.content) 
        ? message.content.map(c => c.content).join(' ') 
        : message.content.content;
      
      addAsset('text', content, [message.sender], {
        messageType: 'conversation',
        timestamp: messageWithId.timestamp
      });
    }
  };
  
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
  }, [conversationHistory.length, initialMessage]);
  
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message to conversation
    addConversationMessage({
      sender: "user",
      content: {
        type: "text",
        content: inputValue
      }
    });
    
    // Set processing state
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
          content: `Command parsed: ${result.command.action} ${result.command.subject || ''}`
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
  
  const handleSuggestionRequest = () => {
    console.log("Suggestion triggered");
    setSuggestionsVisible(true);
  };
  
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <MessageList 
        messages={conversationHistory} 
        onActionClick={handleActionClick} 
      />
      
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
        
        <MessageInput 
          onSubmit={handleSendMessage}
          onSuggestionRequest={handleSuggestionRequest}
          placeholder={placeholder}
          isProcessing={isProcessing}
        />
        
        {isProcessing && <div className="text-xs text-muted-foreground mt-2">Processing...</div>}
      </Card>
    </div>
  );
};

export default ConversationalInterface;
