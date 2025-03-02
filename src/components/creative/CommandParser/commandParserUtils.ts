
import { CommandIntent, CommandEntity, CommandAttribute, ParsedCommand, CommandParseResult, CommandAction } from './types';
import { toast } from "sonner";

// Simple patterns for command recognition
const intentPatterns: Record<CommandIntent, RegExp[]> = {
  create: [/create|add|draw|make|new|insert/i],
  modify: [/modify|change|edit|update|adjust|transform/i],
  delete: [/delete|remove|erase|clear/i],
  arrange: [/arrange|move|position|place|align|order|layer/i],
  style: [/style|color|fill|stroke|font|design/i],
  animate: [/animate|motion|transition|effect/i],
  save: [/save|store|keep/i],
  export: [/export|download|share/i],
  unknown: [/.*/] // Catch all
};

const entityPatterns: Record<CommandEntity, RegExp[]> = {
  shape: [/circle|square|rectangle|triangle|polygon|ellipse|line|curve|path/i],
  text: [/text|label|title|heading|paragraph|caption|font/i],
  image: [/image|picture|photo|graphic|asset/i],
  layer: [/layer|level|stack|z-index/i],
  color: [/color|hue|shade|tint|palette|rgb|rgba|hex/i],
  size: [/size|width|height|scale|dimension/i],
  position: [/position|location|coordinate|top|bottom|left|right|center/i],
  effect: [/effect|shadow|blur|glow|gradient|opacity|transparency/i],
  unknown: [/.*/] // Catch all
};

// Common attribute patterns
const attributePatterns: Record<string, RegExp> = {
  color: /#[0-9a-f]{3,8}|rgba?\([^)]+\)|[a-z]+ color|blue|red|green|yellow|purple|orange|black|white|gray|grey/i,
  size: /\d+px|\d+%|\d+em|\d+rem|small|medium|large|huge|tiny/i,
  position: /top|bottom|left|right|center|middle|\d+px from \w+/i,
  number: /\d+/
};

/**
 * Parse a command string into structured data
 */
export function parseCommand(text: string): CommandParseResult {
  // Check if command is too short or empty
  if (!text || text.trim().length < 3) {
    return {
      success: false,
      clarificationNeeded: true,
      clarificationQuestion: "Could you provide more details about what you'd like to create or modify?"
    };
  }

  const words = text.toLowerCase().split(/\s+/);
  
  // Detect intent
  let intent: CommandIntent = "unknown";
  let intentConfidence = 0;
  
  Object.entries(intentPatterns).forEach(([potentialIntent, patterns]) => {
    patterns.forEach(pattern => {
      const match = words.some(word => pattern.test(word));
      if (match && potentialIntent !== "unknown") {
        intent = potentialIntent as CommandIntent;
        intentConfidence = 0.7; // Basic confidence score
      }
    });
  });
  
  // Detect entity
  let entity: CommandEntity = "unknown";
  let entityConfidence = 0;
  
  Object.entries(entityPatterns).forEach(([potentialEntity, patterns]) => {
    patterns.forEach(pattern => {
      const match = words.some(word => pattern.test(word));
      if (match && potentialEntity !== "unknown") {
        entity = potentialEntity as CommandEntity;
        entityConfidence = 0.7; // Basic confidence score
      }
    });
  });
  
  // Extract potential attributes
  const attributes: CommandAttribute[] = [];
  
  // Look for color attributes
  const colorMatch = text.match(attributePatterns.color);
  if (colorMatch) {
    attributes.push({
      key: "color",
      value: colorMatch[0]
    });
  }
  
  // Look for size attributes
  const sizeMatch = text.match(attributePatterns.size);
  if (sizeMatch) {
    attributes.push({
      key: "size",
      value: sizeMatch[0]
    });
  }
  
  // Look for position attributes
  const positionMatch = text.match(attributePatterns.position);
  if (positionMatch) {
    attributes.push({
      key: "position",
      value: positionMatch[0]
    });
  }
  
  // Look for numbers that might be relevant
  const numbers = text.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    // Only add if we don't already have a size with this number
    const hasSize = attributes.some(attr => attr.key === "size" && attr.value.toString().includes(numbers[0]));
    if (!hasSize) {
      attributes.push({
        key: "value",
        value: parseInt(numbers[0])
      });
    }
  }
  
  // Calculate overall confidence
  const confidence = (intent !== "unknown" ? intentConfidence : 0.1) * 
                     (entity !== "unknown" ? entityConfidence : 0.3);
  
  // Construct parsed command
  const parsedCommand: ParsedCommand = {
    intent,
    entity,
    attributes,
    rawText: text,
    confidence
  };
  
  // Generate appropriate actions based on the parsed command
  const commandActions = generateActions(parsedCommand);
  
  // Determine if clarification is needed
  const needsClarification = confidence < 0.3 || 
                             (intent === "unknown") || 
                             (entity === "unknown" && !["save", "export"].includes(intent));
  
  // Create suggested alternatives if confidence is low
  let suggestedAlternatives: string[] = [];
  
  if (confidence < 0.5) {
    if (intent !== "unknown" && entity === "unknown") {
      // Suggest entities for the detected intent
      suggestedAlternatives = [
        `${intent} a circle`,
        `${intent} some text`,
        `${intent} an image`
      ];
    } else if (intent === "unknown" && entity !== "unknown") {
      // Suggest intents for the detected entity
      suggestedAlternatives = [
        `create a ${entity}`,
        `modify the ${entity}`,
        `arrange the ${entity}`
      ];
    }
  }
  
  return {
    success: !needsClarification,
    parsedCommand,
    suggestedAlternatives: suggestedAlternatives.length > 0 ? suggestedAlternatives : undefined,
    commandActions,
    clarificationNeeded: needsClarification,
    clarificationQuestion: generateClarificationQuestion(parsedCommand)
  };
}

/**
 * Generate appropriate actions based on the parsed command
 */
function generateActions(parsedCommand: ParsedCommand): CommandAction[] {
  const { intent, entity, attributes } = parsedCommand;
  const actions: CommandAction[] = [];
  
  // Handle different intent types
  switch (intent) {
    case "create":
      actions.push({
        type: "CREATE_ELEMENT",
        payload: { 
          type: entity,
          attributes: attributes.reduce((acc, attr) => {
            acc[attr.key] = attr.value;
            return acc;
          }, {} as Record<string, any>)
        }
      });
      break;
      
    case "modify":
      actions.push({
        type: "MODIFY_ELEMENT",
        payload: { 
          type: entity,
          attributes: attributes.reduce((acc, attr) => {
            acc[attr.key] = attr.value;
            return acc;
          }, {} as Record<string, any>)
        }
      });
      break;
      
    case "delete":
      actions.push({
        type: "DELETE_ELEMENT",
        payload: { 
          type: entity
        }
      });
      break;
      
    case "arrange":
      actions.push({
        type: "ARRANGE_ELEMENT",
        payload: { 
          type: entity,
          position: attributes.find(attr => attr.key === "position")?.value
        }
      });
      break;
      
    case "style":
      actions.push({
        type: "STYLE_ELEMENT",
        payload: { 
          type: entity,
          attributes: attributes.reduce((acc, attr) => {
            acc[attr.key] = attr.value;
            return acc;
          }, {} as Record<string, any>)
        }
      });
      break;
      
    case "animate":
      actions.push({
        type: "ANIMATE_ELEMENT",
        payload: { 
          type: entity,
          effect: attributes.find(attr => attr.key === "effect")?.value
        }
      });
      break;
      
    case "save":
      actions.push({
        type: "SAVE_CREATION",
        payload: { 
          name: attributes.find(attr => attr.key === "name")?.value
        }
      });
      break;
      
    case "export":
      actions.push({
        type: "EXPORT_CREATION",
        payload: { 
          format: attributes.find(attr => attr.key === "format")?.value
        }
      });
      break;
  }
  
  return actions;
}

/**
 * Generate a clarification question based on the parsed command
 */
function generateClarificationQuestion(parsedCommand: ParsedCommand): string {
  const { intent, entity, attributes } = parsedCommand;
  
  if (intent === "unknown") {
    return "What would you like to do? (create, modify, delete, etc.)";
  }
  
  if (entity === "unknown" && !["save", "export"].includes(intent)) {
    return `What would you like to ${intent}? (shape, text, image, etc.)`;
  }
  
  if (attributes.length === 0 && !["delete", "save", "export"].includes(intent)) {
    return `How would you like to ${intent} the ${entity}? Please specify attributes like color, size, or position.`;
  }
  
  return "Could you clarify your instruction a bit more?";
}

/**
 * Execute the parsed command actions
 */
export function executeCommandActions(
  actions: CommandAction[], 
  creativeContext: any
): boolean {
  if (!actions || actions.length === 0) {
    toast.error("No actions to execute");
    return false;
  }
  
  try {
    // Here we would execute the actions using the creative context
    // For now, we'll just log them and notify the user
    console.log("Executing actions:", actions);
    
    actions.forEach(action => {
      // Handle different action types
      switch (action.type) {
        case "CREATE_ELEMENT":
          toast.success(`Created ${action.payload.type}`);
          // In a real implementation, we would call context functions
          // creativeContext.addAsset(...);
          break;
          
        case "MODIFY_ELEMENT":
          toast.success(`Modified ${action.payload.type}`);
          // creativeContext.updateAsset(...);
          break;
          
        case "DELETE_ELEMENT":
          toast.success(`Deleted ${action.payload.type}`);
          // creativeContext.deleteAsset(...);
          break;
          
        case "ARRANGE_ELEMENT":
          toast.success(`Arranged ${action.payload.type}`);
          // Update position/ordering
          break;
          
        case "STYLE_ELEMENT":
          toast.success(`Styled ${action.payload.type}`);
          // Update styling
          break;
          
        case "ANIMATE_ELEMENT":
          toast.success(`Animated ${action.payload.type}`);
          // Add animation
          break;
          
        case "SAVE_CREATION":
          toast.success("Saved creation");
          // Save functionality
          break;
          
        case "EXPORT_CREATION":
          toast.success("Exported creation");
          // Export functionality
          break;
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error executing command actions:", error);
    toast.error("Error executing command");
    return false;
  }
}
