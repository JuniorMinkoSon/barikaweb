// Haptics utility - vibration feedback for mobile interactions
export const haptic = {
  light: () => navigator.vibrate?.([40]),
  medium: () => navigator.vibrate?.([80]),
  heavy: () => navigator.vibrate?.([80, 30, 80]),
  success: () => navigator.vibrate?.([50, 30, 50, 30, 200]),
  error: () => navigator.vibrate?.([200, 100, 200]),
  newOrder: () => navigator.vibrate?.([80, 50, 80, 50, 80]),
  otpReceived: () => navigator.vibrate?.([100, 50, 300]),
  negotiation: () => navigator.vibrate?.([60, 40, 60]),
  deliveryArrived: () => navigator.vibrate?.([200, 100, 200, 100, 400]),
};

// Smart Counter hook with animation
import { useState, useCallback } from 'react';

interface SmartCounterConfig {
  min?: number;
  max?: number;
  step?: number;
  initial?: number;
}

export function useSmartCounter(config: SmartCounterConfig = {}) {
  const { min = 0, max = 999, step = 1, initial = 1 } = config;
  const [value, setValue] = useState(initial);
  const [animDir, setAnimDir] = useState<'up' | 'down' | null>(null);

  const increment = useCallback((amount = step) => {
    setValue(prev => {
      const next = Math.min(prev + amount, max);
      if (next !== prev) {
        setAnimDir('up');
        haptic.light();
        setTimeout(() => setAnimDir(null), 300);
      }
      return next;
    });
  }, [step, max]);

  const decrement = useCallback((amount = step) => {
    setValue(prev => {
      const next = Math.max(prev - amount, min);
      if (next !== prev) {
        setAnimDir('down');
        haptic.light();
        setTimeout(() => setAnimDir(null), 300);
      }
      return next;
    });
  }, [step, min]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, increment, decrement, reset, animDir };
}
