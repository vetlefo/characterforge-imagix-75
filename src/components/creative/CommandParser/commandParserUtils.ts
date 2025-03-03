import { Command, CommandDomain, Parameter, ParameterExtractor } from './types';
import { availableDomains } from './domains';
import { extractParameter } from './parameterExtractor';

export const parseCommand = (input: string): Command | null => {
  // Remove extra spaces and convert to lowercase for easier parsing
  const normalizedInput = input.trim().toLowerCase();

  // Attempt to match the input against available domains
  for (const domain of availableDomains) {
    for (const command of domain.commands) {
      // Create a regex pattern from the command's structure
      const pattern = new RegExp(`^${command.structure.replace(/\{.*?\}/g, '(.+?)')}$`);
      const match = normalizedInput.match(pattern);

      if (match) {
        const parameters: { [key: string]: any } = {};
        let i = 1; // Start from 1 because 0 is the full match

        for (const param of command.parameters) {
          if (match[i]) {
            parameters[param.name] = match[i].trim();
          }
          i++;
        }

        return {
          domain: domain.name,
          command: command.name,
          parameters: parameters,
        };
      }
    }
  }

  return null;
};

export const constructCommandString = (command: Command, commandDomain: CommandDomain): string => {
  const cmd = commandDomain.commands.find(c => c.name === command.command);
  if (!cmd) {
    console.warn(`Command ${command.command} not found in domain ${commandDomain.name}`);
    return '';
  }

  let commandString = cmd.structure;
  for (const param of cmd.parameters) {
    const paramValue = command.parameters[param.name] || '';
    const placeholder = `{${param.name}}`;
    commandString = commandString.replace(placeholder, paramValue);
  }

  return commandString;
};

export const validateCommand = (command: Command, commandDomain: CommandDomain): { valid: boolean; errors: string[] } => {
  const cmd = commandDomain.commands.find(c => c.name === command.command);
  if (!cmd) {
    return { valid: false, errors: [`Command ${command.command} not found in domain ${commandDomain.name}`] };
  }

  const errors: string[] = [];
  for (const param of cmd.parameters) {
    const paramValue = command.parameters[param.name];
    if (param.required && !paramValue) {
      errors.push(`Parameter ${param.name} is required`);
    }

    if (paramValue && param.validationRegex && !new RegExp(param.validationRegex).test(paramValue)) {
      errors.push(`Parameter ${param.name} is invalid`);
    }
  }

  return { valid: errors.length === 0, errors: errors };
};

export const extractParametersFromCommand = async (commandString: string, command: Command): Promise<{ [key: string]: any }> => {
  const parameters: { [key: string]: any } = {};

  // Find the corresponding command definition to get parameter details
  const domain = availableDomains.find(d => d.commands.some(c => c.name === command.command));
  const commandDefinition = domain?.commands.find(c => c.name === command.command);

  if (!commandDefinition) {
    console.warn(`Command definition not found for command: ${command.command}`);
    return parameters;
  }

  for (const parameter of commandDefinition.parameters) {
    try {
      // Extract the parameter value using the defined extraction method
      const extractedValue = extractParameter(parameter);

      if (extractedValue) {
        parameters[parameter.name] = extractedValue;
      }
    } catch (error) {
      console.error(`Error extracting parameter ${parameter.name}:`, error);
      // Handle or log the error as needed
    }
  }

  return parameters;
};
