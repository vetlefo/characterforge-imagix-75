import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { Markdown } from '../ui/markdown';

interface ConversationMessageDemoProps {
  role: 'user' | 'assistant';
  content: string | { type: string; content: (string | React.ReactNode)[] };
  className?: string;
  showAvatar?: boolean;
}

export const ConversationMessageDemo: React.FC<ConversationMessageDemoProps> = ({
  role,
  content,
  className,
  showAvatar = true,
}) => {
  const isUser = role === 'user';
  
  const renderContent = () => {
    if (typeof content === 'string') {
      return <Markdown content={content} />;
    }
    
    if (content.type === 'text') {
      return (
        <div className="space-y-4">
          {content.content.map((item, index) => {
            if (typeof item === 'string') {
              return <Markdown key={index} content={item} />;
            }
            return <div key={index}>{item}</div>;
          })}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={cn('flex gap-4 p-4', className)}>
      {showAvatar && (
        <Avatar className={cn('h-8 w-8', isUser ? 'order-last' : '')}>
          <AvatarFallback className={isUser ? 'bg-primary' : 'bg-muted'}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </AvatarFallback>
          <AvatarImage src={isUser ? '/avatars/user.png' : '/avatars/assistant.png'} />
        </Avatar>
      )}
      
      <Card
        className={cn(
          'flex-1 p-4 max-w-[80%]',
          isUser ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {renderContent()}
      </Card>
    </div>
  );
};

export default ConversationMessageDemo;
