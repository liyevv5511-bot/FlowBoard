import { IconButton } from './IconButton';
import { useToolStore } from '../store/useToolStore';
import type { Tool } from '../types';
import {
  SelectIcon,
  RectIcon,
  EllipseIcon,
  ArrowIcon,
  PenIcon,
  TextIcon,
  StickyIcon,
} from './icons';

/** Alət tərifi: dəyər, ikon, ad və klaviatura qısayolu (tooltip üçün). */
const TOOLS: { tool: Tool; label: string; shortcut: string; Icon: typeof SelectIcon }[] = [
  { tool: 'select', label: 'Seç / köçür', shortcut: 'V', Icon: SelectIcon },
  { tool: 'rect', label: 'Düzbucaqlı', shortcut: 'R', Icon: RectIcon },
  { tool: 'ellipse', label: 'Ellips', shortcut: 'O', Icon: EllipseIcon },
  { tool: 'arrow', label: 'Ox', shortcut: 'A', Icon: ArrowIcon },
  { tool: 'pen', label: 'Qələm', shortcut: 'P', Icon: PenIcon },
  { tool: 'text', label: 'Mətn', shortcut: 'T', Icon: TextIcon },
  { tool: 'sticky', label: 'Yapışqan qeyd', shortcut: 'S', Icon: StickyIcon },
];

/** Aktiv çəkmə alətini seçmək üçün üzən mərkəzi alət paneli. */
export function Toolbar() {
  const tool = useToolStore((s) => s.tool);
  const setTool = useToolStore((s) => s.setTool);

  return (
    <div
      role="toolbar"
      aria-label="Çəkmə alətləri"
      className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-panel"
    >
      {TOOLS.map(({ tool: t, label, shortcut, Icon }) => (
        <IconButton
          key={t}
          title={`${label} (${shortcut})`}
          active={tool === t}
          onClick={() => setTool(t)}
        >
          <Icon />
        </IconButton>
      ))}
    </div>
  );
}
