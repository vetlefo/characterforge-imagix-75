
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

// Define the types of content that can be displayed in a message
export type MessageContent = 
  | { type: "text"; content: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "code"; content: string; language?: string }
  | { type: "slider"; min: number; max: number; defaultValue: number[]; onValueChange: (value: number[]) => void; label?: string }
  | { type: "button"; label: string; onClick: () => void; variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" };

export interface ConversationMessageProps {
  sender: "user" | "assistant";
  content: MessageContent | MessageContent[];
  timestamp?: Date;
  className?: string;
}

export const ConversationMessage: React.FC<ConversationMessageProps> = ({
  sender,
  content,
  timestamp = new Date(),
  className,
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
        className
      )}
    >
      <div className={cn(
        "rounded-2xl p-4 backdrop-blur-sm",
        sender === "assistant" 
          ? "bg-[#1A1A2E]/80 border border-[#2A2A4A]/50 text-white" 
          : "bg-[#2C2C50]/80 border border-[#3A3A6A]/50 text-white"
      )}>
        <div className="flex items-center mb-2">
          <div className={cn(
            "h-2 w-2 rounded-full mr-2",
            sender === "assistant" ? "bg-purple-500" : "bg-blue-500"
          )} />
          <span className="font-medium">
            {sender === "assistant" ? "Creative Partner" : "You"}
          </span>
          <span className="text-xs text-gray-400 ml-auto">{formattedTime}</span>
        </div>
        
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

export default ConversationMessage;
