import type { Shape, ShapeType } from '../types';
import { createId } from './id';
import { STICKY_COLORS } from './colors';

/**
 * Forma "factory"-ləri: verilmiş başlanğıc nöqtəsində ağlabatan defolt
 * dəyərlərlə yeni forma yaradırlar. Bütün yaratma məntiqi burada
 * mərkəzləşir ki, komponentlər defolt dəyərləri təkrarlamasın.
 */

/** Yeni formanın istifadəçi tərəfindən seçilmiş cari rəngləri. */
export interface StyleOptions {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

/**
 * Nöqtəvi klik (rect/ellipse/text/sticky) üçün başlanğıc forma yaradır.
 * Sürüklə-yarat və ya klik-yarat sonradan ölçünü tənzimləyir.
 */
export function createShape(
  type: Exclude<ShapeType, 'arrow' | 'pen'>,
  x: number,
  y: number,
  style: StyleOptions,
): Shape {
  const base = { id: createId(), x, y, rotation: 0, opacity: 1 };

  switch (type) {
    case 'rect':
      return {
        ...base,
        type: 'rect',
        width: 120,
        height: 80,
        cornerRadius: 8,
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
      };
    case 'ellipse':
      return {
        ...base,
        type: 'ellipse',
        width: 120,
        height: 120,
        fill: style.fill,
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
      };
    case 'text':
      return {
        ...base,
        type: 'text',
        text: 'Mətn yazın',
        fontSize: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
        fill: style.stroke, // mətn üçün vuruş rəngi daha məntiqlidir
        width: 200,
      };
    case 'sticky':
      return {
        ...base,
        type: 'sticky',
        text: '',
        width: 160,
        height: 160,
        fontSize: 18,
        fill: STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
      };
  }
}

/** Ox üçün başlanğıc forma (sürükləyərək çəkilir). */
export function createArrow(x: number, y: number, style: StyleOptions): Shape {
  return {
    id: createId(),
    type: 'arrow',
    x,
    y,
    rotation: 0,
    opacity: 1,
    points: [0, 0, 0, 0], // sürükləmə zamanı ikinci nöqtə yenilənir
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
  };
}

/** Sərbəst qələm cizgisi üçün başlanğıc forma. */
export function createPen(x: number, y: number, style: StyleOptions): Shape {
  return {
    id: createId(),
    type: 'pen',
    x,
    y,
    rotation: 0,
    opacity: 1,
    points: [0, 0], // ilk nöqtə mənşədə; hərəkət daha çox nöqtə əlavə edir
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
  };
}
