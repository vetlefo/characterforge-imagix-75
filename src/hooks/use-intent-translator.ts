import { useState, useCallback } from 'react';

/**
 * This hook provides access to the intent translation functionality.
 * It abstracts the interaction with the intentTranslator service.
 */
export function useIntentTranslator() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  /**
   * Translates a user message into a structured intent
   */
  const translateIntent = useCallback(async (message: string) => {
    setIsTranslating(true);
    setLastError(null);
    
    try {
      // In a real implementation, this would call the actual intent translator service
      // For now, we'll simulate a response
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Basic intent detection based on message keywords
      let intentType = 'conversation';
      let confidence = 0.7;
      let parameters: Record<string, any> = {};
      
      if (message.toLowerCase().includes('draw') || message.toLowerCase().includes('create')) {
        intentType = 'drawing';
        confidence = 0.85;
        
        // Extract basic parameters
        if (message.toLowerCase().includes('circle')) {
          parameters.shape = 'circle';
        } else if (message.toLowerCase().includes('square')) {
          parameters.shape = 'square';
        }
        
        // Extract colors
        if (message.toLowerCase().includes('red')) {
          parameters.color = 'red';
        } else if (message.toLowerCase().includes('blue')) {
          parameters.color = 'blue';
        } else if (message.toLowerCase().includes('green')) {
          parameters.color = 'green';
        }
      } else if (message.toLowerCase().includes('style') || message.toLowerCase().includes('theme')) {
        intentType = 'styling';
        confidence = 0.8;
        
        if (message.toLowerCase().includes('dark')) {
          parameters.theme = 'dark';
        } else if (message.toLowerCase().includes('light')) {
          parameters.theme = 'light';
        }
      } else if (message.toLowerCase().includes('animate')) {
        intentType = 'animation';
        confidence = 0.9;
        
        if (message.toLowerCase().includes('fade')) {
          parameters.effect = 'fade';
        } else if (message.toLowerCase().includes('slide')) {
          parameters.effect = 'slide';
        }
      }
      
      const result = {
        original: message,
        intent: {
          type: intentType,
          parameters
        },
        confidence,
        alternativeIntents: []
      };
      
      return result;
    } catch (error) {
      setLastError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translateIntent,
    isTranslating,
    lastError
  };
}

export default useIntentTranslator;