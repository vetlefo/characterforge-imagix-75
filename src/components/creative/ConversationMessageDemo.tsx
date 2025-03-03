
import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, ImageIcon, Code, MessageSquare } from "lucide-react";
import { format } from "date-fns";

type MessageContentType = "text" | "image" | "code" | "interactive";

interface MessageContent {
  type: MessageContentType;
  content: string | string[];
}

interface InteractiveElement {
  type: string;
  content: string;
  min?: number;
  max?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  label?: string;
}

interface ConversationMessageProps {
  id: string;
  sender: "user" | "assistant";
  content: MessageContent | InteractiveElement[];
  timestamp: Date;
}

interface MessageGroup {
  id: string;
  title: string;
  messages: ConversationMessageProps[];
}

const ConversationMessageDemo = () => {
  const [expanded, setExpanded] = useState(true);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const demoMessages: MessageGroup = {
    id: "demo-1",
    title: "Creative Drawing Session",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        content: { 
          type: "text", 
          content: "I'd like to draw a landscape with mountains and a lake." 
        },
        timestamp: new Date(2023, 3, 15, 14, 30)
      },
      {
        id: "msg-2",
        sender: "assistant",
        content: [
          { 
            type: "text", 
            content: "I'd be happy to help you create a mountain landscape with a lake. Let me set up some drawing tools for you." 
          },
          { 
            type: "text", 
            content: "You can start by sketching the mountain outlines at the top of the canvas, then add the lake in the foreground." 
          }
        ] as MessageContent[],
        timestamp: new Date(2023, 3, 15, 14, 31)
      },
      {
        id: "msg-3",
        sender: "assistant",
        content: [
          { 
            type: "text", 
            content: "Here's an example to inspire you:" 
          },
          { 
            type: "image", 
            content: "/lovable-uploads/b89881e6-12b4-4527-9c22-1052b8116ca9.png" 
          },
          { 
            type: "text", 
            content: "I've prepared a canvas with some basic tools. Would you like to adjust the brush size before starting?" 
          },
          { 
            type: "interactive", 
            content: "slider",
            min: 1,
            max: 50,
            defaultValue: 10,
            label: "Brush Size"
          }
        ] as InteractiveElement[],
        timestamp: new Date(2023, 3, 15, 14, 32)
      },
      {
        id: "msg-4",
        sender: "user",
        content: { 
          type: "text", 
          content: "Thanks! Can you add some snow on the mountain peaks?" 
        },
        timestamp: new Date(2023, 3, 15, 14, 35)
      },
      {
        id: "msg-5",
        sender: "assistant",
        content: { 
          type: "text", 
          content: "Certainly! To add snow on the mountain peaks, use a white brush with a small size. Focus on the tops of the mountains and add irregular patches that follow the mountain contours. You can also add a bit of light blue for shadows on the snow." 
        },
        timestamp: new Date(2023, 3, 15, 14, 36)
      }
    ]
  };

  return (
    <Card className="p-4 bg-[#1A1A2E] border-[#2A2A4A]">
      <div 
        className="flex items-center justify-between cursor-pointer mb-2"
        onClick={toggleExpanded}
      >
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-400" />
          <h3 className="font-medium">{demoMessages.title}</h3>
        </div>
        <button className="text-gray-400 hover:text-white">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          {demoMessages.messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
            >
              {message.sender === "assistant" && (
                <Avatar className="w-8 h-8 bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <div className="text-xs">AI</div>
                </Avatar>
              )}
              
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === "user" 
                    ? "bg-blue-500/10 border border-blue-500/20" 
                    : "bg-[#232339] border border-[#2A2A4A]"
                }`}
              >
                {Array.isArray(message.content) ? (
                  <div className="space-y-3">
                    {message.content.map((item, index) => {
                      if (item.type === "text") {
                        return <p key={index}>{item.content as string}</p>;
                      } else if (item.type === "image") {
                        return (
                          <div key={index} className="mt-2">
                            <img 
                              src={item.content as string} 
                              alt="Image" 
                              className="rounded-md max-w-full"
                              style={{ maxHeight: "200px" }}
                            />
                          </div>
                        );
                      } else if (item.type === "code") {
                        return (
                          <div key={index} className="mt-2">
                            <div className="bg-[#1A1A2E] p-2 rounded-md">
                              <pre className="text-xs overflow-x-auto">
                                <code>{item.content as string}</code>
                              </pre>
                            </div>
                          </div>
                        );
                      } else if (item.type === "interactive") {
                        if (item.content === "slider") {
                          return (
                            <div key={index} className="mt-3 pt-3 border-t border-[#2A2A4A]">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-400">{item.label}</span>
                                <span className="text-sm font-mono">{item.defaultValue}</span>
                              </div>
                              <Slider 
                                defaultValue={[item.defaultValue as number]} 
                                max={item.max} 
                                min={item.min}
                                step={1}
                                onValueChange={(value) => item.onValueChange && item.onValueChange(value[0])}
                              />
                            </div>
                          );
                        }
                        return null;
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  <p>{(message.content as MessageContent).content as string}</p>
                )}
                
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-500">
                    {format(message.timestamp, "h:mm a")}
                  </span>
                </div>
              </div>
              
              {message.sender === "user" && (
                <Avatar className="w-8 h-8 bg-green-500/20 text-green-400 border border-green-500/30">
                  <div className="text-xs">You</div>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ConversationMessageDemo;
