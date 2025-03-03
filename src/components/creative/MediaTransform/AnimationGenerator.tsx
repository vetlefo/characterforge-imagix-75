
import React, { useState, useRef, useEffect } from 'react';
import { useMediaTransform } from './MediaTransformContext';
import { useCreative } from '../CreativeContext';
import { useAnimation } from '../AnimationSystem';
import { Button } from '../../ui/button';
import { Slider } from '../../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Play, Pause, Copy, Check, RotateCcw, Code, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface AnimationGeneratorProps {
  imageUrl?: string;
  onAnimationGenerated?: (animationId: string) => void;
}

export const AnimationGenerator: React.FC<AnimationGeneratorProps> = ({
  imageUrl,
  onAnimationGenerated
}) => {
  const { generateAnimationFromImage, generatedAnimations, isProcessing } = useMediaTransform();
  const { assets, selectedAssetId, addAsset, createRelationship } = useCreative();
  const { addAnimation } = useAnimation();
  
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('preview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationType, setAnimationType] = useState<string>('fadeIn');
  
  const previewRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Get the image URL from the selected asset or use the provided imageUrl
  const selectedAsset = selectedAssetId 
    ? assets.find(asset => asset.id === selectedAssetId)
    : null;
  
  const effectiveImageUrl = imageUrl || (selectedAsset?.type === 'image' ? selectedAsset.content : '');
  
  // Animation loop
  useEffect(() => {
    const animationLoop = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }
      
      const currentAnimation = generatedAnimations[0];
      if (!currentAnimation) return;
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(100, (elapsed / currentAnimation.duration) * 100);
      
      setAnimationProgress(progress);
      
      if (progress < 100 && isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animationLoop);
      } else if (progress >= 100) {
        setIsPlaying(false);
      }
    };
    
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, generatedAnimations]);

  const handleGenerateAnimation = async () => {
    if (!effectiveImageUrl) {
      toast.error('No image selected for animation generation');
      return;
    }
    
    // Simulate progress updates
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      const generatedAnimation = await generateAnimationFromImage(effectiveImageUrl);
      setProgress(100);
      
      // Add the animation to the animation system
      if (addAnimation) {
        addAnimation({
          name: `generated-animation-${Date.now()}`,
          element: 'div',
          duration: generatedAnimation.duration,
          delay: 0,
          timingFunction: generatedAnimation.timingFunction,
          iterationCount: 'infinite',
          direction: 'normal',
          fillMode: 'forwards',
          keyframes: generatedAnimation.keyframes
        });
      }
      
      // Create an asset for the animation if we have a source asset
      if (selectedAsset) {
        const newAsset = addAsset(
          'other',
          generatedAnimation.css,
          ['generated', 'animation', 'css'],
          { 
            generatedFrom: selectedAsset.id, 
            generatedAt: new Date(),
            animationType: animationType
          }
        );
        
        // Create a relationship between the source asset and the generated animation
        createRelationship(
          selectedAsset.id,
          newAsset.id,
          'iteration',
          8,
          { transformationType: 'animation-generation' }
        );
      }
      
      toast.success('Animation generated successfully');
      
      if (onAnimationGenerated) {
        onAnimationGenerated(generatedAnimation.id);
      }
      
      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000);
      
      // Auto-play the animation
      setIsPlaying(true);
      startTimeRef.current = null;
      setAnimationProgress(0);
    } catch (error) {
      toast.error('Failed to generate animation');
      setProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode('css');
    toast.success('Copied CSS to clipboard');
    
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (animationProgress >= 100) {
        // Reset animation if it's completed
        setAnimationProgress(0);
        startTimeRef.current = null;
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setAnimationProgress(0);
    startTimeRef.current = null;
  };

  const handleSliderChange = (value: number[]) => {
    setAnimationProgress(value[0]);
    setIsPlaying(false);
    startTimeRef.current = performance.now() - (value[0] / 100) * (generatedAnimations[0]?.duration || 1000);
  };

  const applyAnimationStyles = () => {
    const animation = generatedAnimations[0];
    if (!animation || !previewRef.current || !effectiveImageUrl) return null;
    
    // Find the keyframe at the current progress
    const sortedKeyframes = [...animation.keyframes].sort((a, b) => a.time - b.time);
    
    let startKeyframe = sortedKeyframes[0];
    let endKeyframe = sortedKeyframes[sortedKeyframes.length - 1];
    
    for (let i = 0; i < sortedKeyframes.length - 1; i++) {
      if (animationProgress >= sortedKeyframes[i].time && animationProgress <= sortedKeyframes[i + 1].time) {
        startKeyframe = sortedKeyframes[i];
        endKeyframe = sortedKeyframes[i + 1];
        break;
      }
    }
    
    // Interpolate between keyframes
    const keyframeProgress = endKeyframe.time === startKeyframe.time 
      ? 0 
      : (animationProgress - startKeyframe.time) / (endKeyframe.time - startKeyframe.time);
    
    // Build inline styles
    const styles: React.CSSProperties = {};
    
    // Apply all properties from the current keyframe
    Object.entries(startKeyframe.properties).forEach(([prop, value]) => {
      // @ts-ignore - dynamic properties
      styles[prop] = value;
    });
    
    // If playing or at 100%, don't use inline styles, use the animation
    if (isPlaying || animationProgress === 100) {
      styles.animation = `${animationType} ${animation.duration}ms ${animation.timingFunction}`;
    }
    
    return styles;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {effectiveImageUrl ? (
          <div className="rounded-lg overflow-hidden border border-border w-24 h-24 flex-shrink-0">
            <img 
              src={effectiveImageUrl} 
              alt="Source image" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-muted w-24 h-24 flex items-center justify-center flex-shrink-0">
            <Code className="text-muted-foreground" size={24} />
          </div>
        )}
        
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-medium">Animation Generator</h3>
          <p className="text-sm text-muted-foreground">
            Create animations from static images
          </p>
          
          {progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <Select 
          value={animationType} 
          onValueChange={setAnimationType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Animation Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fadeIn">Fade In</SelectItem>
            <SelectItem value="slideUp">Slide Up</SelectItem>
            <SelectItem value="zoomIn">Zoom In</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          onClick={handleGenerateAnimation}
          disabled={isProcessing || !effectiveImageUrl}
          className="gap-2"
        >
          <Wand2 size={16} />
          Generate Animation
        </Button>
      </div>
      
      {generatedAnimations.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">CSS Code</TabsTrigger>
            <TabsTrigger value="keyframes">Keyframes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Animation Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="border border-border rounded-lg overflow-hidden bg-muted/30 w-full aspect-video flex items-center justify-center">
                    {effectiveImageUrl && (
                      <div 
                        ref={previewRef} 
                        className="relative max-w-[80%] max-h-[80%]"
                        style={applyAnimationStyles() || {}}
                      >
                        <img 
                          src={effectiveImageUrl} 
                          alt="Animated preview" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full flex flex-col gap-2 mt-4">
                    <Slider
                      value={[animationProgress]}
                      min={0}
                      max={100}
                      step={0.1}
                      onValueChange={handleSliderChange}
                      className="w-full"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Progress: {Math.round(animationProgress)}%
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleReset}
                          className="w-8 h-8"
                        >
                          <RotateCcw size={14} />
                        </Button>
                        
                        <Button
                          variant="default"
                          size="icon"
                          onClick={handlePlayPause}
                          className="w-8 h-8"
                        >
                          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">CSS Animation Code</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(generatedAnimations[0]?.css || '')}
                  className="gap-2 h-8"
                >
                  {copiedCode === 'css' ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy Code
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm font-mono">
                    <code>{generatedAnimations[0]?.css}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="keyframes" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Animation Keyframes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedAnimations[0]?.keyframes
                    .sort((a, b) => a.time - b.time)
                    .map((keyframe, index) => (
                    <div key={keyframe.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Keyframe at {keyframe.time}%</h4>
                        <div className="w-16 h-2 bg-gradient-to-r from-muted-foreground/20 to-primary"></div>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(keyframe.properties).map(([property, value]) => (
                          <div key={property} className="grid grid-cols-3 gap-2">
                            <div className="text-sm text-muted-foreground">{property}:</div>
                            <div className="text-sm font-mono col-span-2">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
