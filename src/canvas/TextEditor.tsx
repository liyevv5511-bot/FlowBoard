import { useEffect, useRef, useState } from 'react';
import type { TextShape, StickyShape } from '../types';
import { worldToScreen, type Viewport } from '../lib/geometry';

/**
 * Mətn və yapışqan qeydləri redaktə etmək üçün kətanın üzərində üzən HTML
 * <textarea>. Konva daxilində mətn redaktəsi mümkün olmadığından, redaktə
 * zamanı forma gizlədilir və onun yerində ekran koordinatlarında bu textarea göstərilir.
 */
interface TextEditorProps {
  shape: TextShape | StickyShape;
  viewport: Viewport;
  onCommit: (text: string) => void;
  onCancel: () => void;
}

export function TextEditor({ shape, viewport, onCommit, onCancel }: TextEditorProps) {
  const [value, setValue] = useState(shape.text);
  const ref = useRef<HTMLTextAreaElement>(null);

  // Açılan kimi fokuslanıb mövcud mətni seçirik.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  const screen = worldToScreen({ x: shape.x, y: shape.y }, viewport);
  const isSticky = shape.type === 'sticky';

  const commit = () => onCommit(value);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        // Escape → ləğv et. Enter (Shift-siz) → mətn üçün təsdiq;
        // yapışqan qeyd çoxsətirlidir, ona görə orada Enter yeni sətir yaradır.
        if (e.key === 'Escape') {
          e.preventDefault();
          onCancel();
        } else if (e.key === 'Enter' && !e.shiftKey && !isSticky) {
          e.preventDefault();
          commit();
        }
        // Qısayolların kətana keçməsinin qarşısını alırıq.
        e.stopPropagation();
      }}
      style={{
        position: 'absolute',
        left: screen.x + (isSticky ? 10 * viewport.scale : 0),
        top: screen.y + (isSticky ? 10 * viewport.scale : 0),
        width: (shape.width - (isSticky ? 20 : 0)) * viewport.scale,
        height: isSticky ? (shape.height - 20) * viewport.scale : 'auto',
        fontSize: shape.fontSize * viewport.scale,
        lineHeight: 1.2,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: isSticky ? '#1f2937' : (shape as TextShape).fill,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      }}
      placeholder={isSticky ? 'Qeyd yazın...' : 'Mətn yazın...'}
    />
  );
}
