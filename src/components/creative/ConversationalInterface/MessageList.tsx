
import React, { useRef, useEffect } from "react";
import { ConversationMessage as ConversationMessageComponent } from "../ConversationMessage";
import { ConversationMessage, Action } from "../types";
import { MessageContent as ComponentMessageContent } from "../ConversationMessage";

interface MessageListProps {
  messages: ConversationMessage[];
  onActionClick: (action: Action) => void;
}

// Helper function to adapt MessageContent from types to ConversationMessage component
const adaptMessageContent = (content: any): ComponentMessageContent | ComponentMessageContent[] => {
  if (Array.isArray(content)) {
    return content.map(c => ({
      type: c.type as any,
      content: c.content,
      ...(c.language ? { language: c.language } : {}),
      ...(c.src ? { src: c.src } : {}),
      ...(c.alt ? { alt: c.alt } : {}),
      ...(c.caption ? { caption: c.caption } : {}),
      ...(c.label ? { label: c.label } : {}),
    }));
  }
  
  return {
    type: content.type as any,
    content: content.content,
    ...(content.language ? { language: content.language } : {}),
    ...(content.src ? { src: content.src } : {}),
    ...(content.alt ? { alt: content.alt } : {}),
    ...(content.caption ? { caption: content.caption } : {}),
    ...(content.label ? { label: content.label } : {}),
  };
};

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
          content={adaptMessageContent(message.content)}
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
