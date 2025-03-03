
// Parameter types that can be extracted from commands
export interface ExtractedParameters {
  colors?: string[];
  sizes?: string[];
  positions?: string[];
  shapes?: string[];
  timing?: string[];
  text?: string;
  numbers?: number[];
  [key: string]: any;
}

// Utility function to extract a color from text
// Handles named colors, hex codes, and rgb/rgba values
export function extractColors(text: string): string[] {
  const colors: string[] = [];
  
  // Named colors (limited set for example)
  const namedColors = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 
    'white', 'gray', 'grey', 'brown', 'cyan', 'magenta', 'teal', 'lime',
    'maroon', 'navy', 'olive', 'silver', 'aqua', 'fuchsia'
  ];
  
  // Pattern for hex colors
  const hexColorPattern = /#([0-9a-f]{3}|[0-9a-f]{6})\b/gi;
  
  // Pattern for rgb/rgba colors
  const rgbColorPattern = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)/gi;
  
  // Extract named colors
  namedColors.forEach(color => {
    const colorRegex = new RegExp(`\\b${color}\\b`, 'gi');
    if (colorRegex.test(text)) {
      colors.push(color);
    }
  });
  
  // Extract hex colors
  const hexMatches = text.match(hexColorPattern);
  if (hexMatches) {
    colors.push(...hexMatches);
  }
  
  // Extract rgb/rgba colors
  const rgbMatches = text.match(rgbColorPattern);
  if (rgbMatches) {
    colors.push(...rgbMatches);
  }
  
  return colors;
}

// Utility function to extract sizes from text
export function extractSizes(text: string): string[] {
  const sizes: string[] = [];
  
  // Pattern for pixel values
  const pixelPattern = /\b\d+px\b/gi;
  
  // Pattern for percentage values
  const percentagePattern = /\b\d+%\b/gi;
  
  // Pattern for em/rem values
  const emRemPattern = /\b\d+(\.\d+)?(em|rem)\b/gi;
  
  // Pattern for relative size descriptions
  const relativeSizePattern = /\b(small|medium|large|tiny|huge|bigger|smaller)\b/gi;
  
  // Extract pixel values
  const pixelMatches = text.match(pixelPattern);
  if (pixelMatches) {
    sizes.push(...pixelMatches);
  }
  
  // Extract percentage values
  const percentageMatches = text.match(percentagePattern);
  if (percentageMatches) {
    sizes.push(...percentageMatches);
  }
  
  // Extract em/rem values
  const emRemMatches = text.match(emRemPattern);
  if (emRemMatches) {
    sizes.push(...emRemMatches);
  }
  
  // Extract relative size descriptions
  const relativeSizeMatches = text.match(relativeSizePattern);
  if (relativeSizeMatches) {
    sizes.push(...relativeSizeMatches);
  }
  
  return sizes;
}

// Utility function to extract positions from text
export function extractPositions(text: string): string[] {
  const positions: string[] = [];
  
  // Common position terms
  const positionTerms = [
    'top', 'bottom', 'left', 'right', 'center', 'middle',
    'top-left', 'top-right', 'bottom-left', 'bottom-right',
    'above', 'below', 'beside', 'inside', 'outside',
    'foreground', 'background'
  ];
  
  // Extract position terms
  positionTerms.forEach(position => {
    const positionRegex = new RegExp(`\\b${position}\\b`, 'gi');
    if (positionRegex.test(text)) {
      positions.push(position);
    }
  });
  
  // Pattern for coordinates
  const coordinatePattern = /\b(\d+)\s*,\s*(\d+)\b/g;
  const coordinateMatches = text.match(coordinatePattern);
  if (coordinateMatches) {
    positions.push(...coordinateMatches);
  }
  
  return positions;
}

// Utility function to extract shapes from text
export function extractShapes(text: string): string[] {
  const shapes: string[] = [];
  
  // Common shape terms
  const shapeTerms = [
    'circle', 'square', 'rectangle', 'triangle', 'oval', 'ellipse',
    'star', 'heart', 'diamond', 'polygon', 'line', 'curve', 'path',
    'rounded rectangle', 'arrow', 'pentagon', 'hexagon', 'octagon'
  ];
  
  // Extract shape terms
  shapeTerms.forEach(shape => {
    const shapeRegex = new RegExp(`\\b${shape}\\b`, 'gi');
    if (shapeRegex.test(text)) {
      shapes.push(shape);
    }
  });
  
  return shapes;
}

// Utility function to extract timing information from text
export function extractTiming(text: string): string[] {
  const timing: string[] = [];
  
  // Pattern for time units
  const timeUnitPattern = /\b\d+(\.\d+)?\s*(s|ms|seconds|milliseconds)\b/gi;
  
  // Pattern for duration descriptions
  const durationPattern = /\b(slow|fast|quick|immediate|instant|delay|pause)\b/gi;
  
  // Extract time units
  const timeUnitMatches = text.match(timeUnitPattern);
  if (timeUnitMatches) {
    timing.push(...timeUnitMatches);
  }
  
  // Extract duration descriptions
  const durationMatches = text.match(durationPattern);
  if (durationMatches) {
    timing.push(...durationMatches);
  }
  
  return timing;
}

// Utility function to extract numbers from text
export function extractNumbers(text: string): number[] {
  const numberPattern = /-?\b\d+(\.\d+)?\b/g;
  const matches = text.match(numberPattern);
  
  if (!matches) {
    return [];
  }
  
  return matches.map(match => parseFloat(match));
}

// Main parameter extraction function
export function extractParameters(text: string): ExtractedParameters {
  const parameters: ExtractedParameters = {};
  
  const colors = extractColors(text);
  if (colors.length > 0) {
    parameters.colors = colors;
  }
  
  const sizes = extractSizes(text);
  if (sizes.length > 0) {
    parameters.sizes = sizes;
  }
  
  const positions = extractPositions(text);
  if (positions.length > 0) {
    parameters.positions = positions;
  }
  
  const shapes = extractShapes(text);
  if (shapes.length > 0) {
    parameters.shapes = shapes;
  }
  
  const timing = extractTiming(text);
  if (timing.length > 0) {
    parameters.timing = timing;
  }
  
  const numbers = extractNumbers(text);
  if (numbers.length > 0) {
    parameters.numbers = numbers;
  }
  
  return parameters;
}
