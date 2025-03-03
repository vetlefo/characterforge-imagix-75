
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useCreative } from "@/components/creative/CreativeContext";
import intentTranslator, { TranslationResult, TranslationContext } from "@/services/intentTranslator";
import graphDB from "@/services/graphDB";

// Helper function to get a color based on confidence score
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return "bg-green-500";
  if (confidence >= 0.5) return "bg-yellow-500";
  return "bg-red-500";
};

// Helper function to format parameters for display
const formatParameters = (params: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return "No parameters detected";
  }
  
  return Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value.join(", ")}]`;
      } else if (typeof value === "object" && value !== null) {
        return `${key}: ${JSON.stringify(value)}`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .join("\n");
};

const IntentTranslatorDemo = () => {
  const { assets, lastPrompt, addAsset, tags, selectedAssetId } = useCreative();
  
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("default");
  const [showExplanation, setShowExplanation] = useState(true);
  const [contextEnabled, setContextEnabled] = useState(true);
  
  // Add some sample nodes to the graph DB for demo purposes
  useEffect(() => {
    // Only add test nodes if the graph is empty
    if (graphDB.getAllNodes().length === 0) {
      try {
        // Create some test nodes
        const drawingNode = graphDB.createNode(
          "drawing-1", 
          "drawing", 
          { description: "Red circle drawing", parameters: { color: "red", shape: "circle" } }
        );
        
        const styleNode = graphDB.createNode(
          "style-1", 
          "styling", 
          { description: "Dark theme", parameters: { theme: "dark", primaryColor: "#333" } }
        );
        
        const animationNode = graphDB.createNode(
          "animation-1", 
          "animation", 
          { description: "Fade-in animation", parameters: { effect: "fade", duration: 2 } }
        );
        
        // Create relationships
        graphDB.createRelationship(
          "rel-1",
          drawingNode.id,
          styleNode.id,
          "applies",
          { description: "Style applied to drawing" }
        );
        
        graphDB.createRelationship(
          "rel-2",
          drawingNode.id,
          animationNode.id,
          "animates",
          { description: "Animation applied to drawing" }
        );
        
        console.log("Created test nodes in graph DB for demo");
      } catch (error) {
        console.error("Error setting up test graph:", error);
      }
    }
  }, []);

  // Use the last prompt if available
  useEffect(() => {
    if (lastPrompt && !userInput) {
      setUserInput(lastPrompt);
    }
  }, [lastPrompt]);
  
  // Build translation context using CreativeContext data
  const buildContext = (): TranslationContext => {
    // Get last 5 prompts from assets of type "text"
    const textAssets = assets
      .filter(asset => asset.type === "text")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);
      
    const conversationHistory = textAssets.map(asset => asset.content);
    
    return {
      conversationHistory: contextEnabled ? conversationHistory : [],
      selectedAssetId: contextEnabled ? selectedAssetId : null,
    };
  };

  // Function to handle translation
  const handleTranslate = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter some text to translate");
      return;
    }
    
    setIsTranslating(true);
    
    try {
      let translationResult;
      const context = buildContext();
      
      if (selectedStrategy === "default") {
        translationResult = await intentTranslator.translateIntent(userInput, context);
      } else if (selectedStrategy === "best") {
        translationResult = await intentTranslator.translateWithBestStrategy(userInput, context);
      } else {
        // Use specific strategy
        const strategies = intentTranslator.getStrategies();
        const strategy = strategies.find(s => s.name === selectedStrategy);
        
        if (strategy) {
          translationResult = await strategy.translate(userInput, context);
        } else {
          throw new Error(`Strategy ${selectedStrategy} not found`);
        }
      }
      
      setResult(translationResult);
      
      // Save the input as a text asset
      addAsset("text", userInput, ["intent-demo"]);
      
      toast.success("Translation complete");
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Error translating input: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="container p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Intent Translator Demo</h1>
      <p className="text-gray-500 mb-6">
        Translate natural language instructions into structured creative intents with confidence scoring.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>
              Enter a creative instruction to translate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Try: 'Draw a red circle' or 'Create a dark theme with blue accents'"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="min-h-32"
            />
            
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="context-toggle"
                  checked={contextEnabled}
                  onChange={(e) => setContextEnabled(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="context-toggle">Use Context</label>
              </div>
              
              <div className="flex-1">
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="default">Default Strategy</option>
                  <option value="best">Best Strategy</option>
                  <option value="Pattern Matching">Pattern Matching</option>
                  <option value="Context Aware">Context Aware</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleTranslate} 
              disabled={isTranslating || !userInput.trim()}
              className="w-full"
            >
              {isTranslating ? "Translating..." : "Translate"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Result Section */}
        <Card>
          <CardHeader>
            <CardTitle>Translation Result</CardTitle>
            <CardDescription>
              Structured intent with confidence scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Intent Type</h3>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2">
                        {result.intent.domain}
                      </Badge>
                      <Badge>{result.intent.type}</Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <h3 className="font-semibold">Confidence</h3>
                    <div className="flex items-center mt-1">
                      <Progress 
                        value={result.confidence * 100} 
                        className={`h-2 w-24 mr-2 ${getConfidenceColor(result.confidence)}`}
                      />
                      <span>{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <Tabs defaultValue="parameters">
                  <TabsList className="w-full">
                    <TabsTrigger value="parameters" className="flex-1">Parameters</TabsTrigger>
                    <TabsTrigger value="alternatives" className="flex-1">Alternatives</TabsTrigger>
                    <TabsTrigger value="context" className="flex-1">Context</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="parameters">
                    <ScrollArea className="h-40 border rounded p-2">
                      <pre className="whitespace-pre-wrap">
                        {formatParameters(result.parameters)}
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="alternatives">
                    <ScrollArea className="h-40 border rounded p-2">
                      {result.alternativeIntents && result.alternativeIntents.length > 0 ? (
                        <div className="space-y-2">
                          {result.alternativeIntents.map((alt, index) => (
                            <div key={index} className="border-b pb-2">
                              <div className="flex justify-between">
                                <Badge variant="outline">{alt.intent.type}</Badge>
                                <div className="flex items-center">
                                  <Progress 
                                    value={alt.confidence * 100} 
                                    className={`h-2 w-16 mr-2 ${getConfidenceColor(alt.confidence)}`}
                                  />
                                  <span className="text-sm">{(alt.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No alternative interpretations available</p>
                      )}
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="context">
                    <ScrollArea className="h-40 border rounded p-2">
                      {result.relatedNodes && result.relatedNodes.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="font-medium">Related Graph Nodes:</h4>
                          {result.relatedNodes.map((node, index) => (
                            <div key={index} className="border-b pb-2">
                              <Badge variant="outline">{node.type}</Badge>
                              <p className="text-sm mt-1">
                                {node.properties.description || `Node ${node.id}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No related context found</p>
                      )}
                      
                      {result.explanation && showExplanation && (
                        <div className="mt-4 p-2 bg-gray-100 rounded">
                          <h4 className="font-medium">Translation Explanation:</h4>
                          <p className="text-sm">{result.explanation}</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Enter an instruction and click Translate to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Examples Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Example Instructions</CardTitle>
          <CardDescription>Try these examples to see the intent translator in action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            {[
              "Draw a blue square with a black border",
              "Create a dark theme with purple accents",
              "Make the logo fade in over 2 seconds",
              "Add a navigation section to the website",
              "Extract the style from this image",
              "Help me create a responsive layout"
            ].map((example, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => setUserInput(example)}
                className="h-auto py-2 justify-start"
              >
                {example}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntentTranslatorDemo;
