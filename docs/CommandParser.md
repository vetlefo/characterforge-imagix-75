
# Command Parser

The Command Parser interprets natural language instructions and converts them into actions within the application.

## Features

- **Natural Language Processing**: Understand creative instructions
- **Instruction Mapping**: Connect words to specific actions
- **Context Awareness**: Consider the current state when interpreting commands
- **Feedback Mechanisms**: Provide clarification for ambiguous instructions

## Components

### CommandParser

The main component that processes text instructions.

```typescript
// Basic usage
<CommandParser 
  instruction={userInput}
  onParsed={handleParsedCommand}
/>
```

### CommandParserIntegration

Connects the Command Parser to other system components.

## Command Structure

Commands follow a general structure:

1. **Action**: What to do (create, modify, delete)
2. **Subject**: What to act upon (drawing, style, website)
3. **Parameters**: Specific details about the action

Example: "Create a blue circle in the center of the canvas"
- Action: Create
- Subject: Circle
- Parameters: Blue, Center

## Technical Implementation

The Command Parser uses a combination of pattern matching and intent recognition to interpret commands. It maintains a dictionary of supported commands and their variations, along with the corresponding actions to execute.

### Command Parsing Flow

1. Tokenize the input instruction
2. Identify potential actions and subjects
3. Extract parameters from the remaining text
4. Match against known command patterns
5. Execute the corresponding action or request clarification

## Example Commands

- "Create a new drawing with a red background"
- "Change the font size to 18px"
- "Save the current animation as 'bounce'"
- "Show me all assets with the tag 'logo'"

