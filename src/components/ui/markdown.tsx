
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  content: string;
  className?: string;
  [key: string]: any; // This allows for spreading other props to ReactMarkdown
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className, ...props }) => {
  return (
    <div className={className}>
      <ReactMarkdown {...props}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
