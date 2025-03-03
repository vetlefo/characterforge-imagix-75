
# Command Parser

The Command Parser interprets natural language instructions and converts them into actions within the application.

## Features

- **Natural Language Processing**: Understand creative instructions
- **Instruction Mapping**: Connect words to specific actions
- **Context Awareness**: Consider the current state when interpreting commands
- **Feedback Mechanisms**: Provide clarification for ambiguous instructions
- **Domain Classification**: Categorize instructions by creative domain
- **Specialized Parsers**: Dedicated processors for different creative tasks
- **Parameter Extraction**: Identify and extract entities like colors, sizes, and positions

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

## Domain Classification

The Command Parser classifies instructions into domains:

1. **Drawing Domain**: Instructions related to creating and modifying visual elements
   - "Draw a red square"
   - "Add a gradient background"
   
2. **Styling Domain**: Instructions for managing visual appearance
   - "Change the font to Helvetica"
   - "Use a dark color scheme"
   
3. **Animation Domain**: Instructions for movement and transitions
   - "Make the logo bounce"
   - "Create a fade-in animation"
   
4. **Website Domain**: Instructions for web page structure and content
   - "Add a navigation menu"
   - "Create a contact form"
   
5. **Media Domain**: Instructions for media transformation
   - "Extract colors from this image"
   - "Generate code from this design"
   - "Create an animation from this picture"

## Parameter Extraction

The parser identifies and extracts key parameters from instructions:

1. **Colors**: Named colors, hex codes, RGB values
   - "Use #FF5500 for the background"
   - "Make the text blue"
   
2. **Sizes**: Dimensions and measurements
   - "Create a 200px wide box"
   - "Make the text larger"
   
3. **Positions**: Locations and placements
   - "Place the image in the top-right corner"
   - "Center the headline"
   
4. **Shapes**: Geometric and custom forms
   - "Draw a rounded rectangle"
   - "Create a star shape"
   
5. **Timing**: Duration and sequence information
   - "Animate for 2 seconds"
   - "Delay the transition by 500ms"

## Example Commands

### Drawing Commands
- "Create a new drawing with a red background"
- "Draw a blue circle with a 2px black border"
- "Add a gradient from purple to pink"

### Style Commands
- "Change the primary color to #3b82f6"
- "Set the heading font to Montserrat"
- "Increase the spacing between elements"

### Animation Commands
- "Make the logo fade in over 2 seconds"
- "Create a bouncing animation for the button"
- "Add a slide-from-left entrance animation"

### Website Commands
- "Create a responsive navigation bar"
- "Add a contact form with email validation"
- "Change the layout to a two-column grid"

### Media Commands
- "Extract a color palette from this image"
- "Generate HTML/CSS from this design"
- "Create a hover animation from this logo"

## Integration Examples

### With Drawing System
```typescript
const handleParsedCommand = (command) => {
  if (command.domain === 'drawing') {
    drawingSystem.executeCommand(command);
  }
};
```

### With Style System
```typescript
const handleStyleCommand = (command) => {
  if (command.domain === 'styling') {
    styleSystem.applyChanges(command.parameters);
  }
};
```

### With Media Transform
```typescript
const handleMediaCommand = (command) => {
  if (command.domain === 'media' && command.action === 'extract') {
    mediaTransform.extractStyles(command.parameters.source);
  }
};
```

## Technical Implementation

The Command Parser uses a combination of pattern matching and intent recognition to interpret commands. It maintains a dictionary of supported commands and their variations, along with the corresponding actions to execute.

### Command Parsing Flow

1. Tokenize the input instruction
2. Identify potential actions and subjects
3. Extract parameters from the remaining text
4. Match against known command patterns
5. Execute the corresponding action or request clarification
