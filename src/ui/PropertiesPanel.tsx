import { useToolStore } from '../store/useToolStore';
import { useSelectionStore } from '../store/useSelectionStore';
import { useBoard } from '../collab/useBoard';
import { PALETTE } from '../lib/colors';
import { IconButton } from './IconButton';
import { TrashIcon } from './icons';

const STROKE_WIDTHS = [1, 2, 4, 8];

/**
 * Rəng və vuruş idarəetmə paneli.
 *
 * Kontekstə həssasdır:
 *   • Formalar seçilibsə → dəyişikliklər seçilmiş formalara tətbiq olunur.
 *   • Seçim yoxdursa → dəyişikliklər növbəti formanın stilini (toolStore) təyin edir.
 */
export function PropertiesPanel() {
  const { tool, fill, stroke, strokeWidth, setFill, setStroke, setStrokeWidth } = useToolStore();
  const { selectedIds, clear } = useSelectionStore();
  const { shapes, updateShapes, removeShapes } = useBoard();

  const hasSelection = selectedIds.length > 0;

  // Panel yalnız çəkmə aləti aktiv olduqda və ya seçim olduqda görünür.
  if (!hasSelection && tool === 'select') return null;

  // Göstəriləcək cari dəyərlər: seçim varsa ilk formadan, yoxsa alət stilindən.
  const first = hasSelection ? shapes.find((s) => s.id === selectedIds[0]) : undefined;
  const curFill = first && 'fill' in first ? first.fill : fill;
  const curStroke = first && 'stroke' in first ? first.stroke : stroke;
  const curWidth = first && 'strokeWidth' in first ? first.strokeWidth : strokeWidth;

  /** Bir stil sahəsini seçilmiş formalara və ya alət stilinə tətbiq edir. */
  const apply = (patch: Record<string, unknown>, setTool: () => void) => {
    if (hasSelection) {
      updateShapes(selectedIds.map((id) => ({ id, patch })));
    } else {
      setTool();
    }
  };

  const handleDelete = () => {
    removeShapes(selectedIds);
    clear();
  };

  return (
    <div className="w-52 rounded-xl border border-border bg-surface p-3 shadow-panel">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-content-muted">
        {hasSelection ? `Seçim (${selectedIds.length})` : 'Stil'}
      </h2>

      {/* Doldurma rəngi */}
      <Swatches
        label="Doldurma"
        current={curFill}
        onPick={(color) => apply({ fill: color }, () => setFill(color))}
      />

      {/* Vuruş rəngi */}
      <Swatches
        label="Vuruş"
        current={curStroke}
        onPick={(color) => apply({ stroke: color }, () => setStroke(color))}
      />

      {/* Vuruş qalınlığı */}
      <div className="mt-3">
        <span className="mb-1 block text-xs font-medium text-content-muted">Qalınlıq</span>
        <div className="flex gap-1">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              type="button"
              title={`${w}px`}
              onClick={() => apply({ strokeWidth: w }, () => setStrokeWidth(w))}
              className={[
                'flex h-8 flex-1 items-center justify-center rounded-lg border transition-colors',
                curWidth === w ? 'border-accent bg-accent/10' : 'border-border hover:bg-surface-2',
              ].join(' ')}
            >
              <span
                className="rounded-full bg-content"
                style={{ width: 20, height: Math.min(w, 8) }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Silmə düyməsi (yalnız seçim olduqda) */}
      {hasSelection && (
        <div className="mt-3 flex justify-end border-t border-border pt-3">
          <IconButton title="Sil (Delete)" onClick={handleDelete}>
            <TrashIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}

/** Bir rəng sırası (palitra) — seçilmiş rəng vurğulanır. */
function Swatches({
  label,
  current,
  onPick,
}: {
  label: string;
  current: string;
  onPick: (color: string) => void;
}) {
  return (
    <div className="mb-3">
      <span className="mb-1 block text-xs font-medium text-content-muted">{label}</span>
      <div className="grid grid-cols-5 gap-1.5">
        {PALETTE.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            aria-label={`${label}: ${color}`}
            onClick={() => onPick(color)}
            className={[
              'h-7 w-7 rounded-md border transition-transform hover:scale-110',
              current.toLowerCase() === color.toLowerCase()
                ? 'border-accent ring-2 ring-accent'
                : 'border-border',
            ].join(' ')}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
