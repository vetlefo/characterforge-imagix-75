
import React, { useState, useEffect } from 'react';
import { useAnimation } from './AnimationContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { AnimationDefinition, KeyframeType } from '../StyleSystem/types';

const AnimationEditor: React.FC = () => {
  const {
    animations,
    selectedAnimationId,
    updateAnimation,
    deleteAnimation,
    addKeyframe,
    updateKeyframe,
    deleteKeyframe
  } = useAnimation();

  const [editedAnimation, setEditedAnimation] = useState<AnimationDefinition | null>(null);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);

  // Load animation when selection changes
  useEffect(() => {
    if (selectedAnimationId) {
      const animation = animations.find(a => a.id === selectedAnimationId);
      if (animation) {
        setEditedAnimation({ ...animation });
        // Select first keyframe by default
        if (animation.keyframes.length > 0 && !selectedKeyframeId) {
          setSelectedKeyframeId(animation.keyframes[0].id);
        }
      } else {
        setEditedAnimation(null);
        setSelectedKeyframeId(null);
      }
    } else {
      setEditedAnimation(null);
      setSelectedKeyframeId(null);
    }
  }, [selectedAnimationId, animations, selectedKeyframeId]);

  // Save changes to the animation
  const handleSaveAnimation = () => {
    if (editedAnimation && selectedAnimationId) {
      updateAnimation(selectedAnimationId, editedAnimation);
    }
  };

  // Delete current animation
  const handleDeleteAnimation = () => {
    if (selectedAnimationId) {
      deleteAnimation(selectedAnimationId);
    }
  };

  // Handle animation property change
  const handleAnimationChange = (prop: keyof AnimationDefinition, value: any) => {
    if (editedAnimation) {
      setEditedAnimation({
        ...editedAnimation,
        [prop]: value
      });
    }
  };

  // Add a new keyframe
  const handleAddKeyframe = () => {
    if (editedAnimation && selectedAnimationId) {
      const existingTimes = editedAnimation.keyframes.map(kf => kf.time);
      
      // Find a time that doesn't already have a keyframe
      let newTime = 50; // Default to middle
      if (existingTimes.includes(50)) {
        newTime = 75;
        if (existingTimes.includes(75)) {
          newTime = 25;
        }
      }
      
      const newKeyframeId = addKeyframe(selectedAnimationId, {
        time: newTime,
        properties: {
          transform: 'scale(1)',
          opacity: '1'
        }
      });
      
      setSelectedKeyframeId(newKeyframeId);
    }
  };

  // Delete the selected keyframe
  const handleDeleteKeyframe = () => {
    if (editedAnimation && selectedAnimationId && selectedKeyframeId) {
      deleteKeyframe(selectedAnimationId, selectedKeyframeId);
      setSelectedKeyframeId(null);
    }
  };

  // Get the currently selected keyframe
  const selectedKeyframe = editedAnimation?.keyframes.find(kf => kf.id === selectedKeyframeId);

  // Update keyframe time
  const handleKeyframeTimeChange = (time: number) => {
    if (editedAnimation && selectedAnimationId && selectedKeyframeId) {
      updateKeyframe(selectedAnimationId, selectedKeyframeId, { time });
    }
  };

  // Update keyframe property
  const handleKeyframePropertyChange = (property: string, value: string) => {
    if (editedAnimation && selectedAnimationId && selectedKeyframeId) {
      updateKeyframe(selectedAnimationId, selectedKeyframeId, {
        properties: {
          ...selectedKeyframe?.properties,
          [property]: value
        }
      });
    }
  };

  if (!editedAnimation) {
    return (
      <div className="bg-[#0A0A1B] border border-[#2A2A4A] rounded-xl p-4">
        <div className="text-center text-gray-400 py-6">
          <p>Select an animation to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A1B] border border-[#2A2A4A] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-white">Animation Editor</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveAnimation}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteAnimation}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Animation Properties */}
        <div className="bg-[#1A1A2E] rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-white">Animation Properties</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="animation-name">Name</Label>
                <Input
                  id="animation-name"
                  value={editedAnimation.name}
                  onChange={(e) => handleAnimationChange('name', e.target.value)}
                  className="bg-[#2A2A3A] border-[#3A3A4A]"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="animation-element">Element</Label>
                <Select
                  value={editedAnimation.element}
                  onValueChange={(value) => handleAnimationChange('element', value)}
                >
                  <SelectTrigger className="bg-[#2A2A3A] border-[#3A3A4A]">
                    <SelectValue placeholder="Element type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="div">div</SelectItem>
                    <SelectItem value="span">span</SelectItem>
                    <SelectItem value="button">button</SelectItem>
                    <SelectItem value="img">img</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="animation-duration">Duration (ms)</Label>
                <Input
                  id="animation-duration"
                  type="number"
                  value={editedAnimation.duration}
                  onChange={(e) => handleAnimationChange('duration', parseInt(e.target.value))}
                  className="bg-[#2A2A3A] border-[#3A3A4A]"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="animation-delay">Delay (ms)</Label>
                <Input
                  id="animation-delay"
                  type="number"
                  value={editedAnimation.delay}
                  onChange={(e) => handleAnimationChange('delay', parseInt(e.target.value))}
                  className="bg-[#2A2A3A] border-[#3A3A4A]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="animation-timing">Timing Function</Label>
                <Select
                  value={editedAnimation.timingFunction}
                  onValueChange={(value) => handleAnimationChange('timingFunction', value)}
                >
                  <SelectTrigger className="bg-[#2A2A3A] border-[#3A3A4A]">
                    <SelectValue placeholder="Timing function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">linear</SelectItem>
                    <SelectItem value="ease">ease</SelectItem>
                    <SelectItem value="ease-in">ease-in</SelectItem>
                    <SelectItem value="ease-out">ease-out</SelectItem>
                    <SelectItem value="ease-in-out">ease-in-out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="animation-iterations">Iterations</Label>
                <Select
                  value={editedAnimation.iterationCount}
                  onValueChange={(value) => handleAnimationChange('iterationCount', value)}
                >
                  <SelectTrigger className="bg-[#2A2A3A] border-[#3A3A4A]">
                    <SelectValue placeholder="Iterations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="infinite">infinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="animation-direction">Direction</Label>
                <Select
                  value={editedAnimation.direction}
                  onValueChange={(value: any) => handleAnimationChange('direction', value)}
                >
                  <SelectTrigger className="bg-[#2A2A3A] border-[#3A3A4A]">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">normal</SelectItem>
                    <SelectItem value="reverse">reverse</SelectItem>
                    <SelectItem value="alternate">alternate</SelectItem>
                    <SelectItem value="alternate-reverse">alternate-reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="animation-fill">Fill Mode</Label>
                <Select
                  value={editedAnimation.fillMode}
                  onValueChange={(value: any) => handleAnimationChange('fillMode', value)}
                >
                  <SelectTrigger className="bg-[#2A2A3A] border-[#3A3A4A]">
                    <SelectValue placeholder="Fill mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">none</SelectItem>
                    <SelectItem value="forwards">forwards</SelectItem>
                    <SelectItem value="backwards">backwards</SelectItem>
                    <SelectItem value="both">both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Keyframe Editor */}
        <div className="bg-[#1A1A2E] rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white">Keyframes</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddKeyframe}
                title="Add Keyframe"
              >
                <Plus size={14} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteKeyframe}
                disabled={!selectedKeyframeId || editedAnimation.keyframes.length <= 1}
                title="Delete Keyframe"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {editedAnimation.keyframes.map(keyframe => (
              <Button
                key={keyframe.id}
                variant={selectedKeyframeId === keyframe.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedKeyframeId(keyframe.id)}
                className="text-xs"
              >
                {keyframe.time}%
              </Button>
            ))}
          </div>
          
          {selectedKeyframe ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="keyframe-time">Keyframe Time ({selectedKeyframe.time}%)</Label>
                  <span className="text-xs text-gray-400">Drag to adjust</span>
                </div>
                <Slider
                  id="keyframe-time"
                  value={[selectedKeyframe.time]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleKeyframeTimeChange(value)}
                />
              </div>
              
              <div className="space-y-3">
                <h4 className="text-xs font-medium text-gray-300">CSS Properties</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="prop-transform">Transform</Label>
                  <Input
                    id="prop-transform"
                    value={selectedKeyframe.properties.transform || ''}
                    onChange={(e) => handleKeyframePropertyChange('transform', e.target.value)}
                    placeholder="e.g. scale(1.2) rotate(45deg)"
                    className="bg-[#2A2A3A] border-[#3A3A4A]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prop-opacity">Opacity</Label>
                  <Input
                    id="prop-opacity"
                    value={selectedKeyframe.properties.opacity || ''}
                    onChange={(e) => handleKeyframePropertyChange('opacity', e.target.value)}
                    placeholder="e.g. 0.5"
                    className="bg-[#2A2A3A] border-[#3A3A4A]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prop-bg-color">Background Color</Label>
                  <Input
                    id="prop-bg-color"
                    value={selectedKeyframe.properties.backgroundColor || ''}
                    onChange={(e) => handleKeyframePropertyChange('backgroundColor', e.target.value)}
                    placeholder="e.g. #ff0000 or rgba(255,0,0,0.5)"
                    className="bg-[#2A2A3A] border-[#3A3A4A]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prop-custom">Custom Property</Label>
                  <div className="grid grid-cols-5 gap-2">
                    <Input
                      className="col-span-2 bg-[#2A2A3A] border-[#3A3A4A]"
                      placeholder="Property name"
                    />
                    <Input
                      className="col-span-2 bg-[#2A2A3A] border-[#3A3A4A]"
                      placeholder="Value"
                    />
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-6">
              <p>Select a keyframe to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationEditor;
