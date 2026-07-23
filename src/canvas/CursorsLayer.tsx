import { Layer, Group, Path, Text, Label, Tag } from 'react-konva';
import type { PresenceState } from '../types';

/**
 * Digər istifadəçilərin canlı kursorlarını (ad + rəng ilə) render edir.
 *
 * Kursorlar DÜNYA koordinatlarında gəlir və Stage transformu altındakı
 * Layer-də çəkilir — beləliklə hər kursor öz istifadəçisinin göstərdiyi
 * dünya nöqtəsində görünür, hər izləyicinin zoom/pan-ından asılı olmayaraq.
 * Ölçü sabit qalması üçün ox `1/scale` ilə əks-miqyaslanır.
 */
interface CursorsLayerProps {
  others: PresenceState[];
  /** Cari zoom — kursoru ekran ölçüsündə sabit saxlamaq üçün. */
  scale: number;
}

// Sadə ox formalı kursor (SVG path).
const CURSOR_PATH = 'M0 0 L0 16 L4.5 12 L7 18 L9.5 17 L7 11 L13 11 Z';

export function CursorsLayer({ others, scale }: CursorsLayerProps) {
  const inv = 1 / scale; // əks-miqyas

  return (
    <Layer listening={false}>
      {others.map((peer) => {
        if (!peer.cursor) return null;
        return (
          <Group key={peer.user.id} x={peer.cursor.x} y={peer.cursor.y} scaleX={inv} scaleY={inv}>
            <Path data={CURSOR_PATH} fill={peer.user.color} stroke="white" strokeWidth={1} />
            <Label x={14} y={10}>
              <Tag fill={peer.user.color} cornerRadius={4} />
              <Text
                text={peer.user.name}
                fontSize={12}
                fontFamily="Inter, system-ui, sans-serif"
                fill="white"
                padding={5}
              />
            </Label>
          </Group>
        );
      })}
    </Layer>
  );
}
