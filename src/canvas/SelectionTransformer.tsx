import { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import type Konva from 'konva';

/**
 * Seçilmiş formaların üzərinə Konva Transformer (ölçü/fırlanma tutacaqları) yerləşdirir.
 * Konva Transformer imperativ API-dir, ona görə seçim dəyişdikcə node-ları
 * effekt daxilində əl ilə bağlayırıq.
 */
interface SelectionTransformerProps {
  /** Seçilmiş formaların canlı Konva node-ları. */
  nodes: Konva.Node[];
}

export function SelectionTransformer({ nodes }: SelectionTransformerProps) {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const transformer = trRef.current;
    if (!transformer) return;
    transformer.nodes(nodes);
    transformer.getLayer()?.batchDraw();
  }, [nodes]);

  return (
    <Transformer
      ref={trRef}
      rotateEnabled
      // Çox kiçik ölçüləri önləyirik.
      boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
      anchorStroke="#6366f1"
      anchorFill="#ffffff"
      anchorSize={8}
      borderStroke="#6366f1"
      borderDash={[4, 4]}
    />
  );
}
