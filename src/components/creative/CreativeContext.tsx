
import { createContext, useContext, useState, ReactNode } from "react";

interface CreativeContextType {
  activeDrawing: boolean;
  setActiveDrawing: (active: boolean) => void;
  currentIntent: string;
  setCurrentIntent: (intent: string) => void;
  suggestionsVisible: boolean;
  setSuggestionsVisible: (visible: boolean) => void;
  lastPrompt: string;
  setLastPrompt: (prompt: string) => void;
  triggerSuggestion: () => void;
}

const CreativeContext = createContext<CreativeContextType | undefined>(undefined);

export const CreativeProvider = ({ children }: { children: ReactNode }) => {
  const [activeDrawing, setActiveDrawing] = useState(false);
  const [currentIntent, setCurrentIntent] = useState("");
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const triggerSuggestion = () => {
    setSuggestionsVisible(true);
    // This would typically generate a suggestion based on the current intent
    // For now we'll just use a simple implementation
  };

  return (
    <CreativeContext.Provider
      value={{
        activeDrawing,
        setActiveDrawing,
        currentIntent,
        setCurrentIntent,
        suggestionsVisible,
        setSuggestionsVisible,
        lastPrompt,
        setLastPrompt,
        triggerSuggestion
      }}
    >
      {children}
    </CreativeContext.Provider>
  );
};

export const useCreative = () => {
  const context = useContext(CreativeContext);
  if (context === undefined) {
    throw new Error("useCreative must be used within a CreativeProvider");
  }
  return context;
};
