import chroma from 'chroma-js';

export interface DynamicTheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  rangeBg: string;
  accent: string;
}

const FALLBACK_THEME: DynamicTheme = {
  primary: '#71717a', // zinc-500
  primaryDark: '#3f3f46', // zinc-700
  primaryLight: '#f4f4f5', // zinc-100
  rangeBg: 'rgba(244, 244, 245, 0.15)',
  accent: '#a1a1aa', // zinc-400
};

/**
 * Generates a full theme based on a dominant color.
 */
const generateTheme = (rgb: [number, number, number]): DynamicTheme => {
  const base = chroma(rgb);
  
  // Primary: The main brand color, softened
  // We want a soft feel, so we ensure it's not too dark or too saturated
  let primaryColor = base;
  if (primaryColor.get('hsl.l') < 0.4) primaryColor = primaryColor.set('hsl.l', 0.5);
  if (primaryColor.get('hsl.s') > 0.6) primaryColor = primaryColor.set('hsl.s', 0.5);
  
  const primary = primaryColor.hex();
  
  // Primary Dark: For hover states
  const primaryDark = primaryColor.darken(0.5).hex();
  
  // Primary Light: For subtle backgrounds
  const primaryLight = primaryColor.brighten(1.8).desaturate(1.2).hex();
  
  // Range Background: Very light, soft version of the primary
  const rangeBg = chroma(primary).alpha(0.15).css();
  
  // Accent: A slightly different tone for small details
  const accent = primaryColor.set('hsl.h', '+30').hex();

  return {
    primary,
    primaryDark,
    primaryLight,
    rangeBg,
    accent,
  };
};

/**
 * Extracts the average color from an image using a hidden canvas.
 */
const getAverageColor = (img: HTMLImageElement): [number, number, number] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [128, 128, 128];
  
  canvas.width = 1;
  canvas.height = 1;
  ctx.drawImage(img, 0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  return [data[0], data[1], data[2]];
};

export const extractThemeFromImage = async (imageUrl: string): Promise<DynamicTheme> => {
  if (typeof window === 'undefined') return FALLBACK_THEME;

  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      
      img.onload = () => {
        try {
          const rgb = getAverageColor(img);
          resolve(generateTheme(rgb));
        } catch (e) {
          console.error('Theme extraction error:', e);
          resolve(FALLBACK_THEME);
        }
      };
      
      img.onerror = () => {
        console.error('Image load error for theme extraction');
        resolve(FALLBACK_THEME);
      };
    });
  } catch (error) {
    console.error('Failed to extract theme from image:', error);
    return FALLBACK_THEME;
  }
};
