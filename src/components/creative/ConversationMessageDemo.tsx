import React from 'react';
import { Avatar } from '../ui/avatar';
import { AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { MessageCircle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface ConversationMessageProps {
  id: string;
  sender: "user" | "assistant";
  content: {
    type: "text" | "image" | "code";
    content: string | string[];
  };
  timestamp: Date;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({
  id,
  sender,
  content,
  timestamp
}) => {
  const isUser = sender === "user";
  const messageContent = Array.isArray(content.content) ? content.content : [content.content];

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center">
          {!isUser && (
            <Avatar className="mr-2">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col">
            {messageContent.map((message, index) => (
              <div
                key={`${id}-${index}`}
                className={`rounded-lg p-3 text-sm w-fit max-w-[400px] ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                {content.type === "text" ? (
                  message
                ) : content.type === "image" ? (
                  <img src={message} alt="Message Image" className="max-w-full rounded-md" />
                ) : (
                  <pre className="text-xs font-mono">{message}</pre>
                )}
              </div>
            ))}
          </div>
          {isUser && (
            <Avatar className="ml-2">
              <AvatarImage src="https://github.com/sadmann7.png" alt="@sadmann7" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
          )}
        </div>
        <span className="text-xs text-gray-500 mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

interface ExampleMessageGroup {
  id: string;
  title: string;
  messages: ConversationMessageProps[];
}

interface ConversationDemoProps {
  messageGroup: ExampleMessageGroup;
}

const ConversationMessageDemo: React.FC<ConversationDemoProps> = ({ messageGroup }) => {
  return (
    <div className="w-full flex flex-col rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <MessageCircle size={20} className="text-muted-foreground" />
          <h2 className="text-lg font-semibold">{messageGroup.title}</h2>
        </div>
        <Badge variant="secondary">3 Messages</Badge>
      </div>
      <Separator />
      <ScrollArea className="flex-1 h-[300px]">
        <div className="p-4">
          {messageGroup.messages.map(message => (
            <ConversationMessage key={message.id} {...message} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Update the example message group to match the required types
const exampleMessageGroup: ExampleMessageGroup = {
  id: "group-1",
  title: "Generate a Landing Page",
  messages: [
    {
      id: "msg-1",
      sender: "user",
      content: {
        type: "text",
        content: "Generate a landing page for my fitness app called FitQuest."
      },
      timestamp: new Date(Date.now() - 60000)
    },
    {
      id: "msg-2",
      sender: "assistant",
      content: [
        {
          type: "text",
          content: "I'll create a landing page for your fitness app FitQuest. What specific features would you like to highlight?"
        }
      ],
      timestamp: new Date(Date.now() - 45000)
    },
    {
      id: "msg-3",
      sender: "user",
      content: {
        type: "text",
        content: "I want to showcase workout tracking, personalized fitness plans, and social sharing."
      },
      timestamp: new Date(Date.now() - 30000)
    },
    {
      id: "msg-4",
      sender: "assistant",
      content: [
        {
          type: "text",
          content: "Okay, I'm generating a landing page design that highlights workout tracking, personalized fitness plans, and social sharing for FitQuest. Here's a preview:"
        },
        {
          type: "image",
          content: "https://placehold.co/600x400/png",
        },
        {
          type: "text",
          content: "Do you like this direction? Should I refine the color scheme or layout?"
        }
      ],
      timestamp: new Date(Date.now() - 15000)
    }
  ]
};

export default ConversationMessageDemo;
