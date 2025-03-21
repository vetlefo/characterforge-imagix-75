
import { describe, it, expect, beforeEach, vi } from 'vitest';
import intentTranslator, { 
  PatternMatchingStrategy, 
  ContextAwareStrategy, 
  IntentTranslator 
} from './intentTranslator';
import { Intent } from '../components/creative/CommandParser/intentClassifier';
import graphDB from './graphDB';

// Mock dependencies
vi.mock('./graphDB', () => ({
  default: {
    getNode: vi.fn(),
    getNodeRelationships: vi.fn().mockReturnValue([]),
    executeQuery: vi.fn().mockReturnValue([]),
  },
}));

vi.mock('../components/creative/CommandParser/intentClassifier', () => ({
  classifyIntent: vi.fn().mockImplementation((input) => {
    if (input.includes('draw')) {
      return Promise.resolve({
        domain: 'drawing',
        type: 'draw.shape',
        parameters: { shape: 'circle' },
        confidence: 0.8,
        rawInput: input
      });
    }
    return Promise.resolve({
      domain: 'general',
      type: 'conversation',
      parameters: {},
      confidence: 0.5,
      rawInput: input
    });
  }),
}));

describe('PatternMatchingStrategy', () => {
  let strategy: PatternMatchingStrategy;

  beforeEach(() => {
    strategy = new PatternMatchingStrategy();
  });

  it('should translate draw commands correctly', async () => {
    const result = await strategy.translate('draw a red circle');
    
    expect(result.original).toBe('draw a red circle');
    expect(result.intent.domain).toBe('drawing');
    expect(result.intent.type).toBe('drawing');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('should have low confidence for ambiguous inputs', async () => {
    const result = await strategy.translate('hello there');
    
    expect(result.confidence).toBeLessThan(0.6);
    expect(result.intent.domain).toBe('general');
  });
});

describe('ContextAwareStrategy', () => {
  let strategy: ContextAwareStrategy;

  beforeEach(() => {
    strategy = new ContextAwareStrategy();
    vi.clearAllMocks();
  });

  it('should use context to improve confidence', async () => {
    const baseResult = await strategy.translate('circle');
    
    const contextResult = await strategy.translate('circle', {
      conversationHistory: ['Let\'s draw some shapes', 'I want to create a design']
    });
    
    // With context, confidence should be higher
    expect(contextResult.confidence).toBeGreaterThan(baseResult.confidence);
  });

  it('should generate alternative intents', async () => {
    const result = await strategy.translate('draw a shape');
    
    expect(result.alternativeIntents.length).toBeGreaterThan(0);
    expect(result.alternativeIntents[0].intent).toBeDefined();
    expect(result.alternativeIntents[0].confidence).toBeLessThan(result.confidence);
  });

  it('should query graph DB for related nodes when context provided', async () => {
    const mockNode = { id: 'node-1', type: 'shape', properties: { color: 'blue' } };
    (graphDB.executeQuery as any).mockReturnValueOnce([mockNode]);
    
    await strategy.translate('draw a circle', {
      selectedAssetId: 'asset-1'
    });
    
    expect(graphDB.executeQuery).toHaveBeenCalled();
  });
});

describe('IntentTranslator', () => {
  it('should use the default strategy', async () => {
    const result = await intentTranslator.translateIntent('draw a red circle');
    
    expect(result.original).toBe('draw a red circle');
    expect(result.intent).toBeDefined();
  });
  
  it('should compare multiple strategies and pick the best one', async () => {
    const result = await intentTranslator.translateWithBestStrategy('draw a circle');
    
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.intent).toBeDefined();
  });
  
  it('should provide access to all available strategies', () => {
    const strategies = intentTranslator.getStrategies();
    
    expect(strategies.length).toBeGreaterThan(0);
    expect(strategies[0].name).toBeDefined();
  });
});
