
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ConversationMessage, { ConversationMessageProps } from "./ConversationMessage";
import { Button } from "@/components/ui/button";
import { ChevronDown, MessageSquareQuote } from "lucide-react";

export interface ConversationGroup {
  id: string;
  title: string;
  messages: ConversationMessageProps[];
}

export interface ConversationHistoryProps {
  messages: ConversationMessageProps[];
  groups?: ConversationGroup[];
  onLoadMore?: () => Promise<boolean>;
  className?: string;
  highlightedMessageId?: string;
  onHighlightMessage?: (messageId: string | null) => void;
  maxInitialMessages?: number;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  groups = [],
  onLoadMore,
  className,
  highlightedMessageId,
  onHighlightMessage,
  maxInitialMessages = 15
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [visibleMessages, setVisibleMessages] = useState<ConversationMessageProps[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize visible messages
  useEffect(() => {
    if (messages.length > 0) {
      setVisibleMessages(messages.slice(-maxInitialMessages));
    }
  }, [messages, maxInitialMessages]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (visibleMessages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages.length]);

  // Handle infinite scrolling
  const handleScroll = async () => {
    if (!containerRef.current || isLoadingMore || !hasMoreMessages || !onLoadMore) return;
    
    const { scrollTop } = containerRef.current;
    
    if (scrollTop === 0) {
      setIsLoadingMore(true);
      try {
        const hasMore = await onLoadMore();
        setHasMoreMessages(hasMore);
      } catch (error) {
        console.error("Error loading more messages:", error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Reference a message
  const referenceMessage = (messageId: string) => {
    if (onHighlightMessage) {
      onHighlightMessage(messageId === highlightedMessageId ? null : messageId);
    }
  };

  return (
    <div 
      className={cn("flex flex-col h-full overflow-y-auto", className)}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className="py-2 text-center">
          <div className="animate-pulse text-sm text-gray-400">Loading earlier messages...</div>
        </div>
      )}
      
      {/* Messages list */}
      <div className="flex-1 space-y-4 p-4">
        {/* Individual messages */}
        {visibleMessages.map((message, index) => {
          // Add an ID if not present
          const messageWithId = { 
            ...message, 
            id: message.id || `msg-${index}` 
          };
          
          return (
            <div key={messageWithId.id} className="relative group">
              {/* Reference button */}
              <button 
                onClick={() => referenceMessage(messageWithId.id as string)}
                className="absolute -left-10 top-2 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Reference this message"
              >
                <MessageSquareQuote size={16} className="text-gray-400" />
              </button>
              
              <ConversationMessage 
                {...messageWithId} 
                className={cn(
                  highlightedMessageId === messageWithId.id && "ring-2 ring-purple-500/50 ring-offset-2 ring-offset-[#0F0F23]"
                )}
              />
            </div>
          );
        })}
        
        {/* Message groups */}
        {groups.map(group => (
          <div key={group.id} className="border border-[#2A2A4A]/30 rounded-xl overflow-hidden mb-6">
            <Button
              variant="ghost"
              className="w-full flex justify-between items-center p-3 bg-[#1A1A2E]/80 hover:bg-[#1A1A2E] text-left"
              onClick={() => toggleGroup(group.id)}
            >
              <span>{group.title}</span>
              <ChevronDown 
                className={cn(
                  "transition-transform", 
                  expandedGroups[group.id] ? "transform rotate-180" : ""
                )} 
                size={16} 
              />
            </Button>
            
            {expandedGroups[group.id] && (
              <div className="p-4 space-y-4 bg-[#0A0A1B]/70">
                {group.messages.map((message, idx) => (
                  <ConversationMessage 
                    key={`${group.id}-msg-${idx}`} 
                    {...message} 
                    id={message.id || `${group.id}-msg-${idx}`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Auto-scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
};

export default ConversationHistory;
