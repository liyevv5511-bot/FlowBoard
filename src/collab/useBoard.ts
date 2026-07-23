import { useCallback, useMemo } from 'react';
import { useRoom, LOCAL_ORIGIN, useForceUpdateOnChange } from './roomContext';
import { shapeToYMap, yMapToShape } from './schema';
import type {
  Shape,
  RectShape,
  EllipseShape,
  ArrowShape,
  PenShape,
  TextShape,
  StickyShape,
} from '../types';

/**
 * Bir formanın hər hansı alt çoxluğuna tətbiq oluna bilən dəyişikliklər.
 * Bütün forma tiplərinin sahələrinin KƏSİŞMƏSİ kimi qurulur ki, hər mümkün
 * sahə (məs. `points`, `width`, `text`) opsional olaraq mövcud olsun —
 * sadəcə `Partial<Omit<Shape, ...>>` union üzərində yalnız ortaq sahələri saxlayardı.
 */
export type ShapePatch = Partial<
  Omit<RectShape, 'id' | 'type'> &
    Omit<EllipseShape, 'id' | 'type'> &
    Omit<ArrowShape, 'id' | 'type'> &
    Omit<PenShape, 'id' | 'type'> &
    Omit<TextShape, 'id' | 'type'> &
    Omit<StickyShape, 'id' | 'type'>
>;

/**
 * Lövhənin əsas məlumat hook-u.
 *
 * Yjs sənədini reaktiv `Shape[]` massivinə (z-sıralamada) çevirir və
 * bütün mutasiya funksiyalarını təqdim edir. Bütün yazılar `LOCAL_ORIGIN`
 * ilə transaction-a bükülür ki, UndoManager onları izləsin.
 */
export function useBoard() {
  const { room } = useRoom();
  const { shapes: shapesMap, order } = room.schema;
  const doc = room.doc;

  // Sənəd hər dəyişdikdə version artır → yenidən render + massivi yenidən qururuq.
  const shapesVersion = useForceUpdateOnChange(shapesMap);
  const orderVersion = useForceUpdateOnChange(order);

  // z-sıralamaya (order massivi) uyğun formaların adi obyekt massivi.
  const shapes = useMemo<Shape[]>(() => {
    const result: Shape[] = [];
    for (const id of order.toArray()) {
      const map = shapesMap.get(id);
      if (map) result.push(yMapToShape(map));
    }
    return result;
    // Version dəyərləri Yjs dəyişikliklərini memo-nun asılılığına çevirir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, shapesMap, shapesVersion, orderVersion]);

  /** Yeni forma əlavə edir və onu z-sıralamanın yuxarısına qoyur. */
  const addShape = useCallback(
    (shape: Shape) => {
      doc.transact(() => {
        shapesMap.set(shape.id, shapeToYMap(shape));
        order.push([shape.id]);
      }, LOCAL_ORIGIN);
    },
    [doc, shapesMap, order],
  );

  /** Tək formanın sahələrini yeniləyir (sahə səviyyəsində birləşir). */
  const updateShape = useCallback(
    (id: string, patch: ShapePatch) => {
      const map = shapesMap.get(id);
      if (!map) return;
      doc.transact(() => {
        for (const [key, value] of Object.entries(patch)) {
          map.set(key, value);
        }
      }, LOCAL_ORIGIN);
    },
    [doc, shapesMap],
  );

  /** Çoxlu formanı tək transaction-da yeniləyir (bir undo addımı = bir jest). */
  const updateShapes = useCallback(
    (updates: { id: string; patch: ShapePatch }[]) => {
      doc.transact(() => {
        for (const { id, patch } of updates) {
          const map = shapesMap.get(id);
          if (!map) continue;
          for (const [key, value] of Object.entries(patch)) {
            map.set(key, value);
          }
        }
      }, LOCAL_ORIGIN);
    },
    [doc, shapesMap],
  );

  /** Verilmiş id-li formaları silir. */
  const removeShapes = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const idSet = new Set(ids);
      doc.transact(() => {
        for (const id of ids) shapesMap.delete(id);
        // order massivindən silinənləri yenidən qururuq.
        const remaining = order.toArray().filter((id) => !idSet.has(id));
        order.delete(0, order.length);
        order.push(remaining);
      }, LOCAL_ORIGIN);
    },
    [doc, shapesMap, order],
  );

  /** Formanı z-sıralamanın ən üstünə gətirir. */
  const bringToFront = useCallback(
    (id: string) => {
      doc.transact(() => {
        const arr = order.toArray();
        const idx = arr.indexOf(id);
        if (idx === -1) return;
        order.delete(idx, 1);
        order.push([id]);
      }, LOCAL_ORIGIN);
    },
    [doc, order],
  );

  return {
    shapes,
    addShape,
    updateShape,
    updateShapes,
    removeShapes,
    bringToFront,
  };
}
