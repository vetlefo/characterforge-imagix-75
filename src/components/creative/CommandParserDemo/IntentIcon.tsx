
import React from 'react';
import { IntentIconProps } from './types';

export const getIntentIcon = (intent: string | undefined): string => {
  if (!intent) return '❓';
  
  // Map intents to emoji icons
  const intentMap: Record<string, string> = {
    'draw.shape': '⭕',
    'draw.line': '➖',
    'draw.erase': '🧹',
    'draw.fill': '🎨',
    'style.changeColor': '🌈',
    'style.changeFont': '📝',
    'style.changeSpacing': '↔️',
    'style.applyTheme': '🎭',
    'animate.fadeIn': '✨',
    'animate.fadeOut': '🌫️',
    'animate.move': '➡️',
    'animate.rotate': '🔄',
    'website.preview': '👁️',
    'website.addSection': '➕',
    'website.editElement': '✏️',
    'website.exportCode': '💾',
    'transform.imageToAnimation': '🎞️',
    'transform.drawingToCode': '📊',
    'transform.styleExtraction': '🎯',
    'conversation': '💬',
    'unknown': '❓'
  };
  
  return intentMap[intent] || '❓';
};

const IntentIcon: React.FC<IntentIconProps> = ({ intent }) => {
  return <span>{getIntentIcon(intent)}</span>;
};

export default IntentIcon;
