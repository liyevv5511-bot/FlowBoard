import { Group, Rect, Ellipse, Arrow, Line, Text } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { Shape } from '../../types';
import type { ShapePatch } from '../../collab/useBoard';

/**
 * Tək bir formanı render edir.
 *
 * Hər forma vahid bir <Group>-a bükülür (x = shape.x, y = shape.y). Belə
 * olduqda sürükləmə və Transformer ilə ölçü dəyişmə bütün forma tipləri üçün
 * eyni cür işləyir: Group daxilində primitiv yerli (0,0-a nisbi) koordinatlarda çəkilir.
 */

interface ShapeNodeProps {
  shape: Shape;
  isSelected: boolean;
  /** Formanın Konva node-una referans — Transformer bunları toplayır. */
  registerNode: (id: string, node: Konva.Node | null) => void;
  onSelect: (id: string, additive: boolean) => void;
  onChange: (id: string, patch: ShapePatch) => void;
  /** Mətn/yapışqan qeyd üçün redaktə rejimini başladır. */
  onStartEdit: (id: string) => void;
  /** Redaktə olunan forma gizlədilir (üstündə HTML textarea göstərilir). */
  isEditing: boolean;
}

export function ShapeNode({
  shape,
  isSelected,
  registerNode,
  onSelect,
  onChange,
  onStartEdit,
  isEditing,
}: ShapeNodeProps) {
  /** Sürükləmə bitəndə yeni dünya mövqeyini yazırıq. */
  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    onChange(shape.id, { x: e.target.x(), y: e.target.y() });
  };

  /**
   * Transformer ilə ölçü dəyişmə/fırlanma bitəndə: Konva miqyası
   * (scaleX/scaleY) node-a tətbiq olunur. Onu 1-ə sıfırlayıb faktiki
   * ölçü/nöqtələrə "bişiririk" ki, sonrakı əməllər təmiz qalsın.
   */
  const handleTransformEnd = (e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Group;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const patch: ShapePatch = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
    };

    if (shape.type === 'arrow' || shape.type === 'pen') {
      // Xətt nöqtələrini miqyasa uyğun yenidən hesablayırıq.
      patch.points = shape.points.map((p, i) => (i % 2 === 0 ? p * scaleX : p * scaleY));
    } else if (shape.type === 'text') {
      // Mətnin hündürlüyü yoxdur — eni və şrift ölçüsünü miqyaslayırıq.
      patch.width = Math.max(20, shape.width * scaleX);
      patch.fontSize = Math.max(6, shape.fontSize * ((scaleX + scaleY) / 2));
    } else {
      // Rect / ellipse / sticky: eni və hündürlüyü miqyaslayırıq (min hədd ilə).
      patch.width = Math.max(5, shape.width * scaleX);
      patch.height = Math.max(5, shape.height * scaleY);
    }

    onChange(shape.id, patch);
  };

  // Bütün formalar üçün ortaq Group xüsusiyyətləri.
  const groupProps = {
    x: shape.x,
    y: shape.y,
    rotation: shape.rotation,
    opacity: isEditing ? 0 : shape.opacity, // redaktə zamanı gizlət
    draggable: true,
    ref: (node: Konva.Group | null) => registerNode(shape.id, node),
    onClick: (e: KonvaEventObject<MouseEvent>) =>
      onSelect(shape.id, e.evt.shiftKey || e.evt.metaKey || e.evt.ctrlKey),
    onTap: () => onSelect(shape.id, false),
    onDragEnd: handleDragEnd,
    onTransformEnd: handleTransformEnd,
    onDblClick:
      shape.type === 'text' || shape.type === 'sticky' ? () => onStartEdit(shape.id) : undefined,
    onDblTap:
      shape.type === 'text' || shape.type === 'sticky' ? () => onStartEdit(shape.id) : undefined,
  };

  return (
    <Group {...groupProps}>
      <ShapePrimitive shape={shape} isSelected={isSelected} />
    </Group>
  );
}

/** Group daxilində forma tipinə uyğun konkret Konva primitivi. */
export function ShapePrimitive({ shape, isSelected }: { shape: Shape; isSelected: boolean }) {
  switch (shape.type) {
    case 'rect':
      return (
        <Rect
          width={shape.width}
          height={shape.height}
          cornerRadius={shape.cornerRadius}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
      );

    case 'ellipse':
      return (
        <Ellipse
          x={shape.width / 2}
          y={shape.height / 2}
          radiusX={shape.width / 2}
          radiusY={shape.height / 2}
          fill={shape.fill}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
      );

    case 'arrow':
      return (
        <Arrow
          points={shape.points}
          stroke={shape.stroke}
          fill={shape.stroke}
          strokeWidth={shape.strokeWidth}
          pointerLength={10}
          pointerWidth={10}
          lineCap="round"
        />
      );

    case 'pen':
      return (
        <Line
          points={shape.points}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          lineCap="round"
          lineJoin="round"
          tension={0.3}
          // Kliklə seçim üçün cizginin "içini" də tıklanabilir edirik.
          hitStrokeWidth={Math.max(12, shape.strokeWidth)}
        />
      );

    case 'text':
      return (
        <Text
          text={shape.text}
          fontSize={shape.fontSize}
          fontFamily={shape.fontFamily}
          fill={shape.fill}
          width={shape.width}
          wrap="word"
        />
      );

    case 'sticky':
      return (
        <>
          <Rect
            width={shape.width}
            height={shape.height}
            cornerRadius={4}
            fill={shape.fill}
            stroke={isSelected ? undefined : 'rgba(0,0,0,0.08)'}
            strokeWidth={1}
            shadowColor="black"
            shadowOpacity={0.15}
            shadowBlur={8}
            shadowOffsetY={2}
          />
          <Text
            text={shape.text || 'İki dəfə klikləyin...'}
            fontSize={shape.fontSize}
            fontFamily="Inter, system-ui, sans-serif"
            fill={shape.text ? '#1f2937' : '#9ca3af'}
            width={shape.width - 20}
            height={shape.height - 20}
            x={10}
            y={10}
            wrap="word"
          />
        </>
      );
  }
}
