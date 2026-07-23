import { useViewportStore } from '../store/useViewportStore';

/** Cari zoom faizini göstərir; klik viewport-u sıfırlayır (100%, mərkəz). */
export function ZoomIndicator() {
  const scale = useViewportStore((s) => s.scale);
  const reset = useViewportStore((s) => s.reset);

  return (
    <button
      type="button"
      onClick={reset}
      title="Zoom-u sıfırla (100%)"
      className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium tabular-nums text-content shadow-panel transition-colors hover:bg-surface-2"
    >
      {Math.round(scale * 100)}%
    </button>
  );
}
