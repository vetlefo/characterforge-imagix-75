
import { domains } from "./domains";
import { Command, ParsedCommand, CommandDomain, CommandParseResult, commonActions } from "./types";
import { extractParameters } from "./parameterExtractor";

/**
 * Processes a user command and confirms the action
 * @param command The user command to process
 */
export const confirmCommand = (command: ParsedCommand): Command => {
  return {
    ...command,
    confirmed: true,
    originalCommand: command.originalCommand || ""
  };
};

/**
 * Extracts the main action from a command
 * @param text The command text to parse
 */
const extractAction = (text: string): string | null => {
  // Look for common verbs that indicate actions
  for (const action of commonActions) {
    if (text.toLowerCase().includes(action)) {
      return action;
    }
  }

  return null;
};

/**
 * Determines the domain of the command
 * @param text The command text to analyze
 */
const determineDomain = (text: string, allowedDomains: CommandDomain[]): CommandDomain => {
  const lowercaseText = text.toLowerCase();
  
  // Check for explicit domain indicators
  for (const domain of allowedDomains) {
    if (domains[domain]) {
      const { indicators, keywords } = domains[domain];
      
      // Check for direct indicators
      for (const indicator of indicators) {
        if (lowercaseText.includes(indicator.toLowerCase())) {
          return domain;
        }
      }
      
      // Check for keyword matches
      let keywordMatches = 0;
      for (const keyword of keywords) {
        if (lowercaseText.includes(keyword.toLowerCase())) {
          keywordMatches++;
        }
      }
      
      // If multiple keywords match, it's likely this domain
      if (keywordMatches >= 2) {
        return domain;
      }
    }
  }
  
  // If no clear domain is found, make a best guess based on keywords
  let bestDomain: CommandDomain = "unknown";
  let bestScore = 0;
  
  for (const domain of allowedDomains) {
    if (domains[domain]) {
      const { keywords } = domains[domain];
      let score = 0;
      
      for (const keyword of keywords) {
        if (lowercaseText.includes(keyword.toLowerCase())) {
          score++;
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestDomain = domain;
      }
    }
  }
  
  return bestScore > 0 ? bestDomain : "unknown";
};

/**
 * Determines the subject of the command
 * @param text The command text
 * @param domain The domain of the command
 * @param action The action being performed
 */
const determineSubject = (text: string, domain: CommandDomain, action: string): string => {
  const lowercaseText = text.toLowerCase();
  
  // Remove the action from the text to help isolate the subject
  const textWithoutAction = lowercaseText.replace(action, "");
  
  // Check for domain-specific subjects
  if (domains[domain]) {
    const { subjects } = domains[domain];
    
    for (const subject of subjects) {
      if (textWithoutAction.includes(subject.toLowerCase())) {
        return subject;
      }
    }
  }
  
  // If no specific subject is found, use a generic one based on the domain
  switch (domain) {
    case "drawing":
      return "canvas";
    case "animation":
      return "animation";
    case "style":
      return "style";
    case "website":
      return "website";
    case "transform":
      return "media";
    case "creative":
      return "project";
    case "general":
      return "application";
    default:
      return "item";
  }
};

/**
 * Parse a command string into a structured command object
 * @param commandText The raw command text from the user
 * @param allowedDomains Domains that are allowed in the current context
 */
export const parseCommand = (
  commandText: string, 
  allowedDomains: CommandDomain[] = ["drawing", "animation", "style", "website", "transform", "creative", "general"]
): CommandParseResult => {
  try {
    const trimmedCommand = commandText.trim();
    
    if (trimmedCommand.length === 0) {
      return {
        success: false,
        error: "Command cannot be empty"
      };
    }
    
    // Extract the action from the command
    const action = extractAction(trimmedCommand);
    
    if (!action) {
      return {
        success: false,
        error: "Could not determine action",
        needsClarification: true,
        clarificationQuestion: "What would you like to do? (create, update, delete, etc.)"
      };
    }
    
    // Determine the domain
    const domain = determineDomain(trimmedCommand, allowedDomains);
    
    if (domain === "unknown") {
      return {
        success: false,
        error: "Could not determine the domain",
        needsClarification: true,
        clarificationQuestion: `What area are you working with? (${allowedDomains.join(", ")})`
      };
    }
    
    // Determine the subject of the command
    const subject = determineSubject(trimmedCommand, domain, action);
    
    // Extract parameters from the command
    const parameters = extractParameters(trimmedCommand, domain, action);
    
    // Determine if the command requires confirmation
    const requiresConfirmation = action === "delete" || 
                                 action === "update" ||
                                 action === "transform";
    
    // Create the command object
    const command: Command = {
      domain,
      action,
      subject,
      parameters,
      requiresConfirmation,
      confidence: 0.8, // Default confidence
      instruction: trimmedCommand,
      originalCommand: trimmedCommand
    };
    
    return {
      success: true,
      command
    };
  } catch (error) {
    console.error("Error parsing command:", error);
    return {
      success: false,
      error: "Failed to parse command due to an error"
    };
  }
};

/**
 * Adds or updates a parameter in a command
 * @param command The command to update
 * @param paramName The parameter name
 * @param paramValue The parameter value
 */
export const updateCommandParameter = (
  command: Command, 
  paramName: string, 
  paramValue: any
): Command => {
  return {
    ...command,
    parameters: {
      ...command.parameters,
      [paramName]: paramValue
    },
    originalCommand: command.originalCommand
  };
};

/**
 * Generates a response to a command
 * @param command The command to respond to
 */
export const generateCommandResponse = (command: Command): string => {
  if (!command) return "I don't understand that command.";
  
  const { action, subject, parameters } = command;
  
  // Simple response templates based on action
  switch (action) {
    case "create":
      return `Created ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "update":
      return `Updated ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "delete":
      return `Deleted ${subject}`;
    
    case "get":
      return `Retrieved ${subject}`;
    
    case "list":
      return `Listed all ${subject}s`;
    
    case "apply":
      return `Applied to ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "generate":
      return `Generated ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "transform":
      return `Transformed ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "extract":
      return `Extracted from ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "analyze":
      return `Analyzed ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "save":
      return `Saved ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "load":
      return `Loaded ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    case "export":
      return `Exported ${subject} ${Object.keys(parameters).length > 0 ? 
        `with ${Object.entries(parameters).map(([k, v]) => `${k}: ${v}`).join(", ")}` : 
        ''}`;
    
    default:
      return `Executed ${action} on ${subject}`;
  }
};
