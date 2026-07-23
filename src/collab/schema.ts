import * as Y from 'yjs';
import type { Shape } from '../types';

/**
 * Yjs sənəd sxemi və tipli çeviricilər.
 *
 * Sənəd strukturu (bir otaq = bir Y.Doc):
 *
 *   shapes : Y.Map< shapeId, Y.Map<field, value> >   ← hər forma İÇ-İÇƏ Y.Map
 *   order  : Y.Array< shapeId >                       ← z-sıralama (aşağı→yuxarı)
 *   meta   : Y.Map                                    ← otaq metaməlumatı
 *
 * NİYƏ hər forma öz Y.Map-ıdır (adi JSON obyekti deyil):
 * belə olduqda birləşmə SAHƏ SƏVİYYƏSİNDƏDİR — bir istifadəçi formanı
 * hərəkət etdirərkən (x/y) başqası rəngini (fill) dəyişsə, hər iki
 * dəyişiklik qorunur. Adi obyekt saxlansaydı, biri digərini üzərinə yazardı.
 */

export const SHAPES_KEY = 'shapes';
export const ORDER_KEY = 'order';
export const META_KEY = 'meta';

/** Sənədin əsas paylaşılan tiplərinə tipli çıxış. */
export interface DocSchema {
  shapes: Y.Map<Y.Map<unknown>>;
  order: Y.Array<string>;
  meta: Y.Map<unknown>;
}

/** Bir Y.Doc-dan sxem tiplərini alır (yoxdursa yaradır). */
export function getSchema(doc: Y.Doc): DocSchema {
  return {
    shapes: doc.getMap<Y.Map<unknown>>(SHAPES_KEY),
    order: doc.getArray<string>(ORDER_KEY),
    meta: doc.getMap<unknown>(META_KEY),
  };
}

/** Adi Shape obyektini iç-içə Y.Map-a çevirir (Yjs-ə yazmaq üçün). */
export function shapeToYMap(shape: Shape): Y.Map<unknown> {
  const map = new Y.Map<unknown>();
  // Sahələri tək-tək qoyuruq ki, hər biri müstəqil CRDT birləşməsi alsın.
  for (const [key, value] of Object.entries(shape)) {
    map.set(key, value);
  }
  return map;
}

/** İç-içə Y.Map-ı adi Shape obyektinə çevirir (React/Konva üçün). */
export function yMapToShape(map: Y.Map<unknown>): Shape {
  // Y.Map.toJSON() bütün sahələri düz obyektə çevirir.
  return map.toJSON() as Shape;
}
