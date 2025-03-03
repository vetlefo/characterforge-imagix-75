
import { MessageContent, Action } from "../types";

/**
 * Generates a simple response based on user input
 */
export const generateSimpleResponse = (input: string): string => {
  if (input.toLowerCase().includes("draw")) {
    return "I can help you with drawing. What would you like to create?";
  } else if (input.toLowerCase().includes("animate") || input.toLowerCase().includes("animation")) {
    return "Animation is a great way to bring your content to life. What kind of animation are you thinking about?";
  } else if (input.toLowerCase().includes("style") || input.toLowerCase().includes("color")) {
    return "Let's talk about styling. Would you like to change colors, typography, or spacing?";
  } else if (input.toLowerCase().includes("website")) {
    return "I can help you with website design and preview. What kind of website are you creating?";
  } else {
    return "I'm here to help with your creative project. You can ask me about drawing, animation, styling, or website creation.";
  }
};

/**
 * Generates potential actions based on user input
 */
export const generatePotentialActions = (input: string): Action[] => {
  const actions: Action[] = [];
  
  if (input.toLowerCase().includes("draw")) {
    actions.push({
      type: "drawing.open",
      label: "Open Drawing Canvas",
      payload: {}
    });
  }
  
  if (input.toLowerCase().includes("animate") || input.toLowerCase().includes("animation")) {
    actions.push({
      type: "animation.open",
      label: "Open Animation Editor",
      payload: {}
    });
  }
  
  if (input.toLowerCase().includes("style") || input.toLowerCase().includes("color")) {
    actions.push({
      type: "style.open",
      label: "Open Style System",
      payload: {}
    });
  }
  
  if (input.toLowerCase().includes("website")) {
    actions.push({
      type: "website.open",
      label: "Open Website Preview",
      payload: {}
    });
  }
  
  return actions;
};
