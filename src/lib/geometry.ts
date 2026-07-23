import type { Shape } from '../types';

/** 2B nöqtə. */
export interface Point {
  x: number;
  y: number;
}

/** Viewport transformu: dünya → ekran çevrilməsi üçün. */
export interface Viewport {
  x: number; // pan offset (ekran pikselləri)
  y: number;
  scale: number; // zoom faktoru
}

/** Ekran (pointer) koordinatını dünya koordinatına çevirir. */
export function screenToWorld(point: Point, viewport: Viewport): Point {
  return {
    x: (point.x - viewport.x) / viewport.scale,
    y: (point.y - viewport.y) / viewport.scale,
  };
}

/** Dünya koordinatını ekran koordinatına çevirir. */
export function worldToScreen(point: Point, viewport: Viewport): Point {
  return {
    x: point.x * viewport.scale + viewport.x,
    y: point.y * viewport.scale + viewport.y,
  };
}

/** Dəyəri [min, max] aralığına sıxışdırır. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formanın dünya koordinatlarında oxa-hizalı sərhəd qutusunu qaytarır.
 * PNG ixracı zamanı bütün formaları əhatə edən sahəni hesablamaq üçün istifadə olunur.
 * (Sadəlik üçün fırlanma nəzərə alınmır — MVP üçün kifayətdir.)
 */
export function getShapeBounds(shape: Shape): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  switch (shape.type) {
    case 'rect':
    case 'ellipse':
    case 'sticky':
      return { x: shape.x, y: shape.y, width: shape.width, height: shape.height };
    case 'text':
      // Mətnin saxlanan hündürlüyü yoxdur — şrift ölçüsündən təxmin edirik.
      return { x: shape.x, y: shape.y, width: shape.width, height: shape.fontSize * 1.4 };
    case 'arrow':
    case 'pen': {
      // Nöqtələr x/y-ə nisbidir → mütləq min/max tapırıq.
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i < shape.points.length; i += 2) {
        xs.push(shape.x + shape.points[i]);
        ys.push(shape.y + shape.points[i + 1]);
      }
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      return {
        x: minX,
        y: minY,
        width: Math.max(...xs) - minX,
        height: Math.max(...ys) - minY,
      };
    }
  }
}
