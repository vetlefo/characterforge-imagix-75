
import React from 'react';
import ReactMarkdown, { Options } from 'react-markdown';

interface MarkdownProps extends Omit<Options, 'children'> {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className, ...props }) => {
  return (
    <ReactMarkdown className={className} {...props}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
