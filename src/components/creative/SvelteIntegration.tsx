
import React, { useEffect, useRef } from 'react';
import { useCreative } from './CreativeContext';
import { useIntentTranslator } from '../../hooks/use-intent-translator';

/**
 * This component demonstrates how to integrate a Svelte component (built with Svelte Anywhere)
 * into our React application. It sets up communication between the React application
 * and the Svelte custom element.
 */
export const SvelteConversationIntegration: React.FC = () => {
  const conversationRef = useRef<HTMLElement & {
    addUserMessage: (content: string) => void;
    addAssistantMessage: (content: string, intent?: string | null, confidence?: number | null) => void;
    setProcessing: (state: boolean) => void;
  }>(null);
  
  const { addAsset } = useCreative();
  const { translateIntent } = useIntentTranslator();

  useEffect(() => {
    // Check if custom elements are already defined
    if (!customElements.get('x-conversation-interface')) {
      console.warn('Custom element x-conversation-interface not found. Make sure Svelte Anywhere is properly set up.');
    }

    // Set up event listener for messages from the Svelte component
    const handleSvelteMessage = async (event: CustomEvent) => {
      const { content } = event.detail;
      
      // Add message to our React context
      // Using addAsset as a temporary solution since addConversationMessage is not available
      addAsset('text', content, ['conversation', 'user'], {
        sender: 'user',
        timestamp: new Date()
      });

      // Use our intent translator to process the message
      const conversationElement = conversationRef.current;
      if (conversationElement) {
        // Set processing state
        conversationElement.setProcessing(true);
        
        try {
          // Translate the user's intent
          const translationResult = await translateIntent(content);
          
          // Process the creative intent
          const response = {
            message: `I understood your intent as "${translationResult.intent.type}" with ${Math.round(translationResult.confidence * 100)}% confidence.`,
            success: true
          };
          
          // Send response back to Svelte component
          conversationElement.addAssistantMessage(
            response.message,
            translationResult.intent.type,
            translationResult.confidence
          );
          
          // Add assistant message to our React context
          addAsset('text', response.message, ['conversation', 'assistant'], {
            sender: 'assistant',
            timestamp: new Date(),
            intentData: {
              type: translationResult.intent.type,
              confidence: translationResult.confidence,
              parameters: translationResult.intent.parameters
            }
          });
        } catch (error) {
          console.error('Error processing message:', error);
          conversationElement.addAssistantMessage(
            "I'm sorry, I encountered an error processing your request.",
            "error",
            0
          );
          
          conversationElement.setProcessing(false);
        }
      }
    };

    // Add event listener after component is mounted
    const conversationElement = conversationRef.current;
    if (conversationElement) {
      conversationElement.addEventListener('message', handleSvelteMessage as EventListener);
    }

    // Clean up event listener on unmount
    return () => {
      if (conversationElement) {
        conversationElement.removeEventListener('message', handleSvelteMessage as EventListener);
      }
    };
  }, [addAsset, translateIntent]);

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Creative Conversation</h2>
      <div className="flex-1 w-full overflow-hidden rounded-lg">
        {/* 
          The x-conversation-interface element is a Svelte component compiled to a custom element.
          We're using TypeScript's JSX.IntrinsicElements to add the proper typing.
        */}
        <x-conversation-interface
          ref={conversationRef}
          height="100%"
          placeholder="Describe what you'd like to create..."
          className="w-full h-full"
        ></x-conversation-interface>
      </div>
    </div>
  );
};

// Add the necessary type definition for the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'x-conversation-interface': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          height?: string;
          placeholder?: string;
        },
        HTMLElement
      >;
    }
  }
}

export default SvelteConversationIntegration;
