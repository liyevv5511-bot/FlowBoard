/**
 * Əsas domen tipləri.
 *
 * Formalar `type` sahəsi üzərində qurulan **discriminated union**-dır.
 * Bu, hər forma tipi üçün tam kompilyasiya-vaxtı təhlükəsizliyi verir:
 * `switch (shape.type)` daxilində TypeScript hər budaqda dəqiq sahələri bilir.
 *
 * Bütün koordinatlar **dünya (canvas) koordinatlarındadır** — viewport
 * (zoom/pan) transformu yalnız render zamanı Konva Stage-ə tətbiq olunur,
 * heç vaxt formanın özündə saxlanmır.
 */

export type ShapeType = 'rect' | 'ellipse' | 'arrow' | 'pen' | 'text' | 'sticky';

/** Bütün alətlər (formalar + seçim aləti). */
export type Tool = 'select' | ShapeType;

/** Hər formanın paylaşdığı ümumi sahələr. */
export interface BaseShape {
  id: string;
  type: ShapeType;
  /** Sol-yuxarı köşənin (və ya xətlər üçün başlanğıc nöqtəsinin) dünya koordinatı. */
  x: number;
  y: number;
  /** Dərəcə ilə fırlanma (Konva Transformer bunu idarə edir). */
  rotation: number;
  opacity: number;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  width: number;
  height: number;
  cornerRadius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  /** Sərhəd qutusunun ölçüsü — radiuslar geometry.ts-də hesablanır. */
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ArrowShape extends BaseShape {
  type: 'arrow';
  /** [x1, y1, x2, y2] — formanın x/y-inə NİSBİ. */
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface PenShape extends BaseShape {
  type: 'pen';
  /** Sərbəst cizgi nöqtələri [x1,y1, x2,y2, ...] — x/y-ə nisbi. */
  points: number[];
  stroke: string;
  strokeWidth: number;
}

export interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  /** Sətir keçidi (word-wrap) üçün genişlik. */
  width: number;
}

export interface StickyShape extends BaseShape {
  type: 'sticky';
  text: string;
  width: number;
  height: number;
  fontSize: number;
  /** Yapışqan qeydin arxa fon rəngi. */
  fill: string;
}

/** Tətbiqdə hər yerdə istifadə olunan əsas forma tipi. */
export type Shape = RectShape | EllipseShape | ArrowShape | PenShape | TextShape | StickyShape;

/**
 * Yalnız `fill`/`stroke` sahəsi olan formaların tipləri —
 * rəng redaktoru panelinin hansı forma üçün göstərilməli olduğunu bildirir.
 */
export type FillableShape = RectShape | EllipseShape | TextShape | StickyShape;
export type StrokableShape = RectShape | EllipseShape | ArrowShape | PenShape;

/** Digər istifadəçinin presence (awareness) məlumatı. */
export interface UserInfo {
  id: number;
  name: string;
  color: string;
}

/** Awareness protokolu vasitəsilə yayımlanan efemer per-user vəziyyət. */
export interface PresenceState {
  user: UserInfo;
  /** Dünya koordinatlarında kursor (canvas-dan kənardadırsa null). */
  cursor: { x: number; y: number } | null;
}
