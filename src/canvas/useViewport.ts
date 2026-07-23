import { useCallback } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useViewportStore, MIN_SCALE, MAX_SCALE } from '../store/useViewportStore';
import { clamp } from '../lib/geometry';

const ZOOM_FACTOR = 1.05;

/**
 * Kətan üçün zoom davranışı: təkər hərəkəti kursorun altındakı dünya
 * nöqtəsinə doğru yaxınlaşdırır/uzaqlaşdırır (Figma/Excalidraw kimi).
 * Pan isə boş sahəni sürükləməklə (Stage draggable) həyata keçir.
 */
export function useViewport() {
  const { x, y, scale, setViewport } = useViewportStore();

  const handleWheel = useCallback(
    (e: KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault();
      const stage = e.target.getStage();
      const pointer = stage?.getPointerPosition();
      if (!stage || !pointer) return;

      const oldScale = scale;
      const direction = e.evt.deltaY > 0 ? -1 : 1; // aşağı = uzaqlaş
      const nextScale = clamp(
        direction > 0 ? oldScale * ZOOM_FACTOR : oldScale / ZOOM_FACTOR,
        MIN_SCALE,
        MAX_SCALE,
      );

      // Kursorun altındakı dünya nöqtəsi zoom-dan sonra da eyni qalmalıdır.
      const worldX = (pointer.x - x) / oldScale;
      const worldY = (pointer.y - y) / oldScale;

      setViewport({
        x: pointer.x - worldX * nextScale,
        y: pointer.y - worldY * nextScale,
        scale: nextScale,
      });
    },
    [x, y, scale, setViewport],
  );

  return { handleWheel };
}
