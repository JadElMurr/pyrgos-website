import { useRef } from 'react';

// Detects horizontal swipes on touch devices. Swiping left calls onLeft (next),
// swiping right calls onRight (prev). Ignores mostly-vertical gestures (scrolling).
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      const t = e.touches[0];
      start.current = { x: t.clientX, y: t.clientY };
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.current.x;
      const dy = t.clientY - start.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) onLeft();
        else onRight();
      }
      start.current = null;
    },
  };
}
