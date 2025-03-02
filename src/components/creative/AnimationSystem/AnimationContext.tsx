
import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AnimationDefinition, KeyframeType, TimelineMarker, AnimationContextType } from '../StyleSystem/types';

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [animations, setAnimations] = useState<AnimationDefinition[]>([]);
  const [selectedAnimationId, setSelectedAnimationId] = useState<string | null>(null);
  const [previewElement, setPreviewElement] = useState<string>('div');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(3000); // 3 seconds default
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);
  
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop
  const animationLoop = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    let currentTimeValue = elapsed % duration;
    
    setCurrentTime(currentTimeValue);
    
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    }
  }, [isPlaying, duration]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now() - currentTime;
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    } else if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [isPlaying, animationLoop, currentTime]);

  const playAnimation = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pauseAnimation = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seekAnimation = useCallback((time: number) => {
    setCurrentTime(time);
    if (isPlaying) {
      startTimeRef.current = performance.now() - time;
    }
  }, [isPlaying]);

  const addAnimation = useCallback((animation: Omit<AnimationDefinition, "id">): string => {
    const id = uuidv4();
    const newAnimation: AnimationDefinition = {
      ...animation,
      id
    };
    
    setAnimations(prev => [...prev, newAnimation]);
    return id;
  }, []);

  const updateAnimation = useCallback((id: string, updates: Partial<Omit<AnimationDefinition, "id">>) => {
    setAnimations(prev => prev.map(anim => 
      anim.id === id ? { ...anim, ...updates } : anim
    ));
  }, []);

  const deleteAnimation = useCallback((id: string) => {
    setAnimations(prev => prev.filter(anim => anim.id !== id));
    if (selectedAnimationId === id) {
      setSelectedAnimationId(null);
    }
  }, [selectedAnimationId]);

  const selectAnimation = useCallback((id: string | null) => {
    setSelectedAnimationId(id);
  }, []);

  const addKeyframe = useCallback((animationId: string, keyframe: Omit<KeyframeType, "id">): string => {
    const id = uuidv4();
    
    setAnimations(prev => prev.map(anim => {
      if (anim.id === animationId) {
        return {
          ...anim,
          keyframes: [...anim.keyframes, { ...keyframe, id }]
        };
      }
      return anim;
    }));
    
    return id;
  }, []);

  const updateKeyframe = useCallback((animationId: string, keyframeId: string, updates: Partial<Omit<KeyframeType, "id">>) => {
    setAnimations(prev => prev.map(anim => {
      if (anim.id === animationId) {
        return {
          ...anim,
          keyframes: anim.keyframes.map(keyframe => 
            keyframe.id === keyframeId 
              ? { ...keyframe, ...updates } 
              : keyframe
          )
        };
      }
      return anim;
    }));
  }, []);

  const deleteKeyframe = useCallback((animationId: string, keyframeId: string) => {
    setAnimations(prev => prev.map(anim => {
      if (anim.id === animationId) {
        return {
          ...anim,
          keyframes: anim.keyframes.filter(keyframe => keyframe.id !== keyframeId)
        };
      }
      return anim;
    }));
  }, []);

  const addMarker = useCallback((marker: Omit<TimelineMarker, "id">): string => {
    const id = uuidv4();
    setMarkers(prev => [...prev, { ...marker, id }]);
    return id;
  }, []);

  const updateMarker = useCallback((id: string, updates: Partial<Omit<TimelineMarker, "id">>) => {
    setMarkers(prev => prev.map(marker => 
      marker.id === id ? { ...marker, ...updates } : marker
    ));
  }, []);

  const deleteMarker = useCallback((id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);

  const exportAnimationCSS = useCallback((id: string): string => {
    const animation = animations.find(anim => anim.id === id);
    if (!animation) return '';

    // Sort keyframes by time
    const sortedKeyframes = [...animation.keyframes].sort((a, b) => a.time - b.time);
    
    // Build keyframes CSS
    let keyframesCSS = `@keyframes ${animation.name} {\n`;
    
    sortedKeyframes.forEach(keyframe => {
      keyframesCSS += `  ${keyframe.time}% {\n`;
      
      Object.entries(keyframe.properties).forEach(([prop, value]) => {
        if (value) {
          keyframesCSS += `    ${prop}: ${value};\n`;
        }
      });
      
      keyframesCSS += '  }\n';
    });
    
    keyframesCSS += '}\n\n';
    
    // Build animation CSS
    const animationCSS = `.${animation.name} {\n` +
      `  animation-name: ${animation.name};\n` +
      `  animation-duration: ${animation.duration}ms;\n` +
      `  animation-timing-function: ${animation.timingFunction};\n` +
      `  animation-delay: ${animation.delay}ms;\n` +
      `  animation-iteration-count: ${animation.iterationCount};\n` +
      `  animation-direction: ${animation.direction};\n` +
      `  animation-fill-mode: ${animation.fillMode};\n` +
      '}\n';
    
    return keyframesCSS + animationCSS;
  }, [animations]);

  const exportAnimationReact = useCallback((id: string): string => {
    const animation = animations.find(anim => anim.id === id);
    if (!animation) return '';

    // Convert to React styled-components or CSS-in-JS format
    return `
// Using styled-components:
import styled, { keyframes } from 'styled-components';

const ${animation.name}Animation = keyframes\`
${animation.keyframes
  .sort((a, b) => a.time - b.time)
  .map(keyframe => `  ${keyframe.time}% {
    ${Object.entries(keyframe.properties)
      .filter(([_, value]) => value)
      .map(([prop, value]) => `${prop}: ${value};`)
      .join('\n    ')}
  }`)
  .join('\n')}
\`;

const Animated${animation.element} = styled.${animation.element.toLowerCase()}\`
  animation-name: \${${animation.name}Animation};
  animation-duration: ${animation.duration}ms;
  animation-timing-function: ${animation.timingFunction};
  animation-delay: ${animation.delay}ms;
  animation-iteration-count: ${animation.iterationCount};
  animation-direction: ${animation.direction};
  animation-fill-mode: ${animation.fillMode};
\`;
`;
  }, [animations]);

  return (
    <AnimationContext.Provider
      value={{
        animations,
        selectedAnimationId,
        previewElement,
        isPlaying,
        currentTime,
        duration,
        markers,
        addAnimation,
        updateAnimation,
        deleteAnimation,
        selectAnimation,
        setPreviewElement,
        addKeyframe,
        updateKeyframe,
        deleteKeyframe,
        playAnimation,
        pauseAnimation,
        seekAnimation,
        addMarker,
        updateMarker,
        deleteMarker,
        exportAnimationCSS,
        exportAnimationReact
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
