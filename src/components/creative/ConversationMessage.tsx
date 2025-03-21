import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import { Action } from "./types";

// Define the types of content that can be displayed in a message
export type MessageContent = 
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "code"; content: string; language?: string }
  | { type: "slider"; min: number; max: number; defaultValue: number[]; onValueChange: (value: number[]) => void; label?: string }
  | { type: "button"; label: string; onClick: () => void; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" };

export interface MessageGroup {
  id: string;
  messages: ConversationMessageProps[];
  title?: string;
}

export interface ConversationMessageProps {
  id?: string;
  sender: "user" | "assistant";
  content: MessageContent | MessageContent[];
  timestamp?: Date;
  className?: string;
  isHighlighted?: boolean;
  referencesMessageId?: string;
  groupId?: string;
  visualIndicator?: "success" | "error" | "warning" | "info";
  actions?: Action[];
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({
  id,
  sender,
  content,
  timestamp = new Date(),
  className,
  isHighlighted,
  referencesMessageId,
  visualIndicator,
  actions
}) => {
  // Format the timestamp
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Convert single content item to array for consistent handling
  const contentArray = Array.isArray(content) ? content : [content];

  return (
    <div
      className={cn(
        "mb-4 max-w-3xl animate-fade-in",
        sender === "assistant" ? "mr-auto" : "ml-auto",
        isHighlighted && "bg-purple-500/10 p-2 rounded-3xl",
        className
      )}
      id={id}
    >
      <div className={cn(
        "rounded-2xl p-4 backdrop-blur-sm",
        sender === "assistant" 
          ? "bg-[#1A1A2E]/80 border border-[#2A2A4A]/50 text-white" 
          : "bg-[#2C2C50]/80 border border-[#3A3A6A]/50 text-white",
        visualIndicator === "success" && "border-l-4 border-l-green-500",
        visualIndicator === "error" && "border-l-4 border-l-red-500",
        visualIndicator === "warning" && "border-l-4 border-l-yellow-500",
        visualIndicator === "info" && "border-l-4 border-l-blue-500"
      )}>
        <div className="flex items-center mb-2">
          <div className={cn(
            "h-2 w-2 rounded-full mr-2",
            sender === "assistant" ? "bg-purple-500" : "bg-blue-500",
            visualIndicator === "success" && "bg-green-500",
            visualIndicator === "error" && "bg-red-500",
            visualIndicator === "warning" && "bg-yellow-500",
            visualIndicator === "info" && "bg-blue-500"
          )} />
          <span className="font-medium">
            {sender === "assistant" ? "Creative Partner" : "You"}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{formattedTime}</span>
        </div>
        
        {/* Show referenced message indicator if present */}
        {referencesMessageId && (
          <div className="bg-[#0F0F23]/80 text-xs text-gray-400 p-2 rounded mb-2 border-l-2 border-purple-500">
            <a href={`#${referencesMessageId}`} className="hover:text-gray-300">
              Referencing previous message
            </a>
          </div>
        )}
        
        <div className="space-y-3">
          {contentArray.map((item, index) => (
            <RenderContent key={index} content={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RenderContent: React.FC<{ content: MessageContent }> = ({ content }) => {
  switch (content.type) {
    case "text":
      return (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{content.content}</ReactMarkdown>
        </div>
      );
    
    case "image":
      return (
        <div className="relative">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-pointer group">
                <img 
                  src={content.src} 
                  alt={content.alt || "Image"} 
                  className="rounded-lg w-full max-h-80 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm">Click to enlarge</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl bg-[#0F0F23]/90 border-[#2A2A4A]">
              <img 
                src={content.src} 
                alt={content.alt || "Image"} 
                className="rounded-lg w-full object-contain max-h-[80vh]"
              />
              {content.caption && (
                <p className="text-center text-sm text-gray-300 mt-2">{content.caption}</p>
              )}
            </DialogContent>
          </Dialog>
          {content.caption && (
            <p className="text-sm text-gray-300 mt-2">{content.caption}</p>
          )}
        </div>
      );
    
    case "code":
      return (
        <div className="bg-[#0A0A1B] rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
            <code>{content.content}</code>
          </pre>
        </div>
      );
    
    case "slider":
      return (
        <div className="space-y-2">
          {content.label && (
            <label className="text-sm text-gray-300">{content.label}</label>
          )}
          <Slider
            min={content.min}
            max={content.max}
            defaultValue={content.defaultValue}
            onValueChange={content.onValueChange}
            className="w-full"
          />
        </div>
      );
    
    case "button":
      return (
        <Button
          variant={content.variant || "default"}
          onClick={content.onClick}
          className="w-auto"
        >
          {content.label}
        </Button>
      );
    
    default:
      return null;
  }
};

export const MessageGroupContainer: React.FC<{
  group: MessageGroup;
  className?: string;
}> = ({ group, className }) => {
  return (
    <Card className={cn("mb-6 border-purple-500/30", className)}>
      {group.title && (
        <div className="bg-purple-800/20 p-2 text-sm font-medium border-b border-purple-500/30">
          {group.title}
        </div>
      )}
      <CardContent className="p-4">
        <div className="space-y-2">
          {group.messages.map((message) => (
            <ConversationMessage key={message.id} {...message} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const InteractiveMessageElement: React.FC<{
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}> = ({ label, children, tooltip }) => {
  return (
    <div className="bg-[#1F1F3A] rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-xs cursor-help">?</div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#0A0A1B] text-white border-purple-500/30">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="interactive-element-container">
        {children}
      </div>
    </div>
  );
};

export default ConversationMessage;
