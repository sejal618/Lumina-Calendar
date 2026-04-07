import { useState, useEffect } from 'react';
import Vibrant from 'node-vibrant';

export interface DynamicTheme {
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
}

export function useDynamicTheme(imageUrl: string) {
  const [theme, setTheme] = useState<DynamicTheme | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Use a smaller version of the image for faster color extraction
    const extractionUrl = imageUrl.includes('?') 
      ? `${imageUrl}&w=100&q=10` 
      : `${imageUrl}?w=100&q=10`;

    Vibrant.from(extractionUrl)
      .getPalette()
      .then((palette) => {
        if (!isMounted) return;

        if (palette.Vibrant) {
          const primary = palette.Vibrant.getHex();
          const secondary = palette.LightVibrant ? palette.LightVibrant.getHex() : primary;
          const accent = palette.DarkVibrant ? palette.DarkVibrant.getHex() : primary;
          const muted = palette.Muted ? palette.Muted.getHex() : primary;

          setTheme({ primary, secondary, accent, muted });

          // Update CSS variables
          document.documentElement.style.setProperty('--dynamic-primary', primary);
          document.documentElement.style.setProperty('--dynamic-secondary', secondary);
          document.documentElement.style.setProperty('--dynamic-accent', accent);
          document.documentElement.style.setProperty('--dynamic-muted', muted);
        }
      })
      .catch((err) => {
        console.error('Error extracting colors:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return theme;
}
