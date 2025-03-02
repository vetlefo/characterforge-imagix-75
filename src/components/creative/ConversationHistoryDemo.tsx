
import React, { useState } from "react";
import ConversationHistory, { ConversationGroup } from "./ConversationHistory";
import { ConversationMessageProps } from "./ConversationMessage";
import { Button } from "@/components/ui/button";
import { Rocket, PlusCircle } from "lucide-react";

const ConversationHistoryDemo = () => {
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessageProps[]>([
    {
      id: "msg-1",
      sender: "assistant",
      content: { 
        type: "text", 
        content: "# Welcome to the Creative Space\n\nI notice you're exploring **fluid landscapes**. Would you like to continue this exploration?" 
      },
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: "msg-2",
      sender: "user",
      content: { 
        type: "text", 
        content: "Yes, I'd like to create something with organic flowing forms and vibrant colors." 
      },
      timestamp: new Date(Date.now() - 3500000)
    },
    {
      id: "msg-3",
      sender: "assistant",
      content: [
        { 
          type: "text", 
          content: "I can help with that! Here's an example of a fluid landscape that might inspire you:" 
        },
        { 
          type: "image", 
          src: "/lovable-uploads/e9db2be9-f0a3-4506-b387-ce20bea67ba9.png", 
          alt: "Fluid landscape",
          caption: "A vibrant fluid landscape with organic flowing forms" 
        }
      ],
      timestamp: new Date(Date.now() - 3400000)
    },
    {
      id: "msg-4",
      sender: "user",
      content: { 
        type: "text", 
        content: "That's beautiful! Can you show me another example with more blues and purples?" 
      },
      timestamp: new Date(Date.now() - 3300000)
    },
    {
      id: "msg-5",
      sender: "assistant",
      content: [
        { 
          type: "text", 
          content: "Here's another example with blues and purples:" 
        },
        { 
          type: "image", 
          src: "/lovable-uploads/fa140a1b-cb9d-457c-a7ca-e630a9052d31.png", 
          alt: "Another fluid landscape",
          caption: "A fluid landscape with blues and purples" 
        }
      ],
      timestamp: new Date(Date.now() - 3200000)
    },
    {
      id: "msg-6",
      sender: "user",
      content: { 
        type: "text", 
        content: "I love this direction. Let me try creating something similar." 
      },
      timestamp: new Date(Date.now() - 3100000)
    },
    {
      id: "msg-7",
      sender: "assistant",
      referencesMessageId: "msg-3",
      content: { 
        type: "text", 
        content: "Referencing our earlier example, would you like me to guide you through creating something with similar flowing forms but with your own color palette?" 
      },
      timestamp: new Date(Date.now() - 3000000)
    }
  ]);

  const groups: ConversationGroup[] = [
    {
      id: "group-1",
      title: "Previous Fluid Landscape Exploration",
      messages: [
        {
          sender: "assistant",
          content: { 
            type: "text", 
            content: "Let's explore how we can blend these colors more effectively." 
          },
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          sender: "user",
          content: { 
            type: "text", 
            content: "I'd like to try using more gradients between the colors." 
          },
          timestamp: new Date(Date.now() - 86300000)
        }
      ]
    },
    {
      id: "group-2",
      title: "Abstract Patterns Discussion",
      messages: [
        {
          sender: "assistant",
          content: { 
            type: "text", 
            content: "Abstract patterns can add depth to your fluid landscapes." 
          },
          timestamp: new Date(Date.now() - 172800000)
        },
        {
          sender: "user",
          content: { 
            type: "text", 
            content: "Can you show me some examples of incorporating geometric patterns?" 
          },
          timestamp: new Date(Date.now() - 172700000)
        },
        {
          sender: "assistant",
          content: [
            { 
              type: "text", 
              content: "Here's an example with geometric patterns incorporated into a fluid landscape:" 
            },
            { 
              type: "image", 
              src: "/lovable-uploads/92333427-5a32-4cf8-b110-afc5b57c9f27.png", 
              alt: "Geometric patterns in fluid landscape",
              caption: "Geometric patterns adding structure to fluid forms" 
            }
          ],
          timestamp: new Date(Date.now() - 172600000)
        }
      ]
    }
  ];

  const loadMoreMessages = async () => {
    // Simulate loading more messages from an API
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const olderMessages: ConversationMessageProps[] = [
          {
            id: "older-1",
            sender: "assistant",
            content: { 
              type: "text", 
              content: "Before we started with fluid landscapes, we explored color theory. Would you like to revisit that?" 
            },
            timestamp: new Date(Date.now() - 7200000)
          },
          {
            id: "older-2",
            sender: "user",
            content: { 
              type: "text", 
              content: "No, I'm happy with the fluid landscapes direction for now." 
            },
            timestamp: new Date(Date.now() - 7100000)
          }
        ];
        
        setMessages(prev => [...olderMessages, ...prev]);
        resolve(true); // true means there are more messages that could be loaded
      }, 1000);
    });
  };

  const addNewMessage = () => {
    const newMessage: ConversationMessageProps = {
      id: `msg-${messages.length + 1}`,
      sender: "assistant",
      content: { 
        type: "text", 
        content: "I've been analyzing your creative style and have some suggestions for your next piece. Would you like to hear them?" 
      },
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium text-white">Conversation History</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={addNewMessage}>
            <PlusCircle size={16} className="mr-2" />
            Add Message
          </Button>
          <Button size="sm" variant="secondary">
            <Rocket size={16} className="mr-2" />
            New Thread
          </Button>
        </div>
      </div>
      
      <div className="flex-1 border border-[#2A2A4A]/30 rounded-xl overflow-hidden">
        <ConversationHistory 
          messages={messages}
          groups={groups}
          onLoadMore={loadMoreMessages}
          highlightedMessageId={highlightedMessageId}
          onHighlightMessage={setHighlightedMessageId}
          maxInitialMessages={5}
        />
      </div>
    </div>
  );
};

export default ConversationHistoryDemo;
