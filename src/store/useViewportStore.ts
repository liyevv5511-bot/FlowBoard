import { create } from 'zustand';
import { clamp } from '../lib/geometry';

/** Zoom hədləri — həddindən artıq yaxınlaşma/uzaqlaşmanı önləyir. */
export const MIN_SCALE = 0.1;
export const MAX_SCALE = 5;

/**
 * Viewport (zoom + pan) — tamamilə yerli və per-user vəziyyət.
 * Formalar dünya koordinatlarında saxlanır; bu transform yalnız
 * render zamanı Konva Stage-ə tətbiq olunur.
 */
interface ViewportState {
  x: number;
  y: number;
  scale: number;

  setViewport: (next: { x: number; y: number; scale: number }) => void;
  reset: () => void;
}

export const useViewportStore = create<ViewportState>((set) => ({
  x: 0,
  y: 0,
  scale: 1,

  setViewport: ({ x, y, scale }) => set({ x, y, scale: clamp(scale, MIN_SCALE, MAX_SCALE) }),
  reset: () => set({ x: 0, y: 0, scale: 1 }),
}));
