
import React, { useMemo, useRef, useEffect } from 'react';
import { useAnimation } from './AnimationContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PlayCircle, PauseCircle, SkipBack, Clock, Code, Download, Plus } from 'lucide-react';

const AnimationPreview: React.FC = () => {
  const {
    animations,
    selectedAnimationId,
    previewElement,
    isPlaying,
    currentTime,
    duration,
    selectAnimation,
    setPreviewElement,
    playAnimation,
    pauseAnimation,
    seekAnimation,
    addAnimation,
    exportAnimationCSS,
    exportAnimationReact
  } = useAnimation();

  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLTextAreaElement>(null);

  const selectedAnimation = useMemo(() => {
    return animations.find(anim => anim.id === selectedAnimationId);
  }, [animations, selectedAnimationId]);

  // Create a preview element
  const PreviewComponent = useMemo(() => {
    // Return a component that applies keyframes at the current time
    const Component = () => {
      const style: React.CSSProperties = {};
      
      if (selectedAnimation && previewRef.current) {
        // Find the keyframes that apply at the current time percentage
        const timePercentage = (currentTime / duration) * 100;
        
        const prevKeyframe = [...selectedAnimation.keyframes]
          .sort((a, b) => a.time - b.time)
          .filter(kf => kf.time <= timePercentage)
          .pop();
          
        const nextKeyframe = [...selectedAnimation.keyframes]
          .sort((a, b) => a.time - b.time)
          .filter(kf => kf.time > timePercentage)
          .shift();
        
        if (prevKeyframe && nextKeyframe) {
          // Calculate interpolation
          const progress = (timePercentage - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
          
          // Apply interpolated styles
          Object.entries(prevKeyframe.properties).forEach(([prop, prevValue]) => {
            if (prevValue && nextKeyframe.properties[prop]) {
              const nextValue = nextKeyframe.properties[prop] as string;
              
              // Handle specific properties that can be interpolated
              if (prop === 'opacity' || prop.includes('color')) {
                // Direct assignment for opacity and colors
                style[prop as any] = prevValue;
              } else if (prop === 'transform') {
                // For transform, just use the previous keyframe value
                style[prop] = prevValue;
              }
            } else if (prevValue) {
              // If property doesn't exist in next keyframe, use prev value
              style[prop as any] = prevValue;
            }
          });
        } else if (prevKeyframe) {
          // Only apply previous keyframe
          Object.entries(prevKeyframe.properties).forEach(([prop, value]) => {
            if (value) {
              style[prop as any] = value;
            }
          });
        } else if (nextKeyframe && selectedAnimation.fillMode === 'both' || selectedAnimation.fillMode === 'backwards') {
          // Apply first keyframe if outside range
          Object.entries(nextKeyframe.properties).forEach(([prop, value]) => {
            if (value) {
              style[prop as any] = value;
            }
          });
        }
      }
      
      return (
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{
            backgroundColor: '#f5f5f5',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}
        >
          {React.createElement(
            previewElement || 'div',
            {
              style: {
                width: '100px',
                height: '100px',
                backgroundColor: '#3b82f6',
                borderRadius: '0.25rem',
                ...style
              },
              className: "transition-all"
            },
            null
          )}
        </div>
      );
    };
    
    return Component;
  }, [selectedAnimation, previewElement, currentTime, duration]);

  // Copy export code to clipboard
  const copyToClipboard = () => {
    if (exportRef.current) {
      exportRef.current.select();
      document.execCommand('copy');
    }
  };

  // Create a new default animation
  const handleAddAnimation = () => {
    addAnimation({
      name: `animation-${animations.length + 1}`,
      element: 'div',
      duration: 1000,
      delay: 0,
      timingFunction: 'ease-in-out',
      iterationCount: '1',
      direction: 'normal',
      fillMode: 'forwards',
      keyframes: [
        {
          id: '1',
          time: 0,
          properties: {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        {
          id: '2',
          time: 100,
          properties: {
            transform: 'scale(1.5)',
            opacity: '0.5'
          }
        }
      ]
    });
  };

  return (
    <div className="bg-[#0A0A1B] border border-[#2A2A4A] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white">Animation Preview</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleAddAnimation}
          className="flex items-center gap-1 text-sm"
        >
          <Plus size={14} />
          New Animation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Preview Area */}
        <div className="lg:col-span-2 bg-[#1A1A2E] rounded-lg p-4 h-[300px]">
          <div ref={previewRef} className="w-full h-full">
            <PreviewComponent />
          </div>
        </div>

        {/* Animation List & Controls */}
        <div className="bg-[#1A1A2E] rounded-lg p-4 flex flex-col">
          <h3 className="text-sm font-medium text-white mb-2">Animations</h3>
          
          {animations.length === 0 ? (
            <div className="text-gray-400 text-sm italic flex flex-col items-center justify-center h-full">
              <p className="mb-2">No animations created yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddAnimation}
                className="flex items-center gap-1 text-sm"
              >
                <Plus size={14} />
                Create Animation
              </Button>
            </div>
          ) : (
            <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto">
              {animations.map(animation => (
                <div 
                  key={animation.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${selectedAnimationId === animation.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-[#2A2A3A] hover:bg-[#3A3A4A]'}`}
                  onClick={() => selectAnimation(animation.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{animation.name}</span>
                    <span className="text-xs text-gray-400">{animation.duration}ms</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {animation.keyframes.length} keyframes
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedAnimation && (
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => seekAnimation(0)}
                    className="h-8 w-8"
                  >
                    <SkipBack size={16} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isPlaying ? pauseAnimation : playAnimation}
                    className="h-8 w-8"
                  >
                    {isPlaying ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {Math.round(currentTime)}ms / {duration}ms
                  </span>
                </div>
              </div>
              
              <div className="px-1">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration}
                  step={1}
                  onValueChange={([value]) => seekAnimation(value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timeline & Export */}
      <div className="bg-[#1A1A2E] rounded-lg p-4">
        <Tabs defaultValue="timeline">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline">
            {selectedAnimation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Keyframes</h3>
                  <div className="text-xs text-gray-400">
                    Drag to adjust timing
                  </div>
                </div>
                
                <div className="relative h-10 bg-[#2A2A3A] rounded-md">
                  <div className="absolute left-0 top-0 w-full h-full flex items-center">
                    {/* Time markers */}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute h-2 border-l border-gray-600"
                        style={{ left: `${i * 10}%` }}
                      >
                        <div className="absolute top-3 left-0 transform -translate-x-1/2 text-xs text-gray-500">
                          {i * 10}%
                        </div>
                      </div>
                    ))}
                    
                    {/* Current time indicator */}
                    <div 
                      className="absolute h-full top-0 w-0.5 bg-blue-500"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                    
                    {/* Keyframe indicators */}
                    {selectedAnimation.keyframes.map(keyframe => (
                      <div
                        key={keyframe.id}
                        className="absolute h-6 w-6 bg-yellow-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-move"
                        style={{ 
                          left: `${keyframe.time}%`,
                          top: '50%'
                        }}
                        title={`Keyframe at ${keyframe.time}%`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm italic text-center py-4">
                Select an animation to view its timeline
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="export">
            {selectedAnimation ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Export Animation</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Code size={12} />
                    Copy Code
                  </Button>
                </div>
                
                <Tabs defaultValue="css">
                  <TabsList>
                    <TabsTrigger value="css">CSS</TabsTrigger>
                    <TabsTrigger value="react">React</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="css">
                    <div className="bg-[#2A2A3A] rounded-md p-2 mt-2">
                      <textarea
                        ref={exportRef}
                        className="w-full h-[150px] bg-transparent text-gray-300 text-xs font-mono resize-none focus:outline-none"
                        readOnly
                        value={exportAnimationCSS(selectedAnimation.id)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="react">
                    <div className="bg-[#2A2A3A] rounded-md p-2 mt-2">
                      <textarea
                        ref={exportRef}
                        className="w-full h-[150px] bg-transparent text-gray-300 text-xs font-mono resize-none focus:outline-none"
                        readOnly
                        value={exportAnimationReact(selectedAnimation.id)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 text-xs"
                >
                  <Download size={12} />
                  Download Animation
                </Button>
              </div>
            ) : (
              <div className="text-gray-400 text-sm italic text-center py-4">
                Select an animation to export
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimationPreview;
