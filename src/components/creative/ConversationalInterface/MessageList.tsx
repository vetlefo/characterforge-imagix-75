
import React, { useRef, useEffect } from "react";
import { ConversationMessage as ConversationMessageComponent } from "../ConversationMessage";
import { ConversationMessage, Action } from "../types";

interface MessageListProps {
  messages: ConversationMessage[];
  onActionClick: (action: Action) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onActionClick 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when conversation history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
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
          onActionClick={onActionClick}
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
  );
};

export default MessageList;
