
// Domain types for command classification
export type CommandDomain = 'drawing' | 'styling' | 'animation' | 'website' | 'general';

// Domain-specific keywords to help with classification
export const domainKeywords: Record<CommandDomain, string[]> = {
  drawing: [
    'draw', 'sketch', 'paint', 'canvas', 'brush', 'erase', 'circle', 'square', 
    'rectangle', 'line', 'shape', 'color', 'fill', 'stroke', 'layer', 'image'
  ],
  styling: [
    'style', 'font', 'color', 'palette', 'theme', 'typography', 'spacing', 
    'margin', 'padding', 'border', 'background', 'gradient', 'shadow', 'effect'
  ],
  animation: [
    'animate', 'animation', 'move', 'rotate', 'scale', 'fade', 'transition', 
    'keyframe', 'sequence', 'timeline', 'duration', 'delay', 'ease', 'bounce'
  ],
  website: [
    'website', 'page', 'html', 'css', 'javascript', 'layout', 'responsive', 
    'header', 'footer', 'navigation', 'menu', 'form', 'button', 'input', 'link'
  ],
  general: [
    'create', 'make', 'update', 'change', 'modify', 'delete', 'remove', 'show', 
    'hide', 'display', 'preview', 'save', 'load', 'import', 'export', 'undo', 'redo'
  ]
};

// Classification function to determine the most likely domain
export function classifyCommand(instruction: string): CommandDomain {
  const lowercaseInstruction = instruction.toLowerCase();
  
  // Count matches for each domain
  const domainCounts = Object.entries(domainKeywords).reduce((counts, [domain, keywords]) => {
    const matchCount = keywords.filter(keyword => 
      lowercaseInstruction.includes(keyword)
    ).length;
    
    counts[domain as CommandDomain] = matchCount;
    return counts;
  }, {} as Record<CommandDomain, number>);
  
  // Find domain with the most matches
  const domainEntries = Object.entries(domainCounts) as [CommandDomain, number][];
  const sortedDomains = domainEntries.sort((a, b) => b[1] - a[1]);
  
  // Return the domain with the most keyword matches
  // If no matches or tie with general, prioritize specific domains
  if (sortedDomains[0][1] === 0 || 
      (sortedDomains[0][1] === sortedDomains[1][1] && sortedDomains[1][0] === 'general')) {
    return sortedDomains.find(([domain]) => domain !== 'general')?.[0] || 'general';
  }
  
  return sortedDomains[0][0];
}
