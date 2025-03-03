
import StyleSystem from './StyleSystem';
import { StyleSystemProvider, useStyleSystem } from './StyleSystemContext';
import { StyleCommandParser } from './StyleCommandParser';
import { ColorPaletteManager } from './ColorPaletteManager';
import { TypographyControls } from './TypographyControls';
import { SpacingSystem } from './SpacingSystem';
import { StyleAdapter } from './StyleAdapter';
import { StylePreview } from './StylePreview';
import { 
  defaultPalettes, 
  defaultTypography, 
  defaultSpacing 
} from './defaultStyles';

export { 
  StyleSystem,
  StyleSystemProvider,
  useStyleSystem,
  StyleCommandParser,
  ColorPaletteManager,
  TypographyControls,
  SpacingSystem,
  StyleAdapter,
  StylePreview,
  defaultPalettes,
  defaultTypography,
  defaultSpacing
};

export default StyleSystem;
