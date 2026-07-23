import { useHistory } from '../collab/useHistory';
import { useCanvasApi } from '../store/useCanvasApi';
import { IconButton } from './IconButton';
import { UndoIcon, RedoIcon, DownloadIcon } from './icons';

/** Geri qaytar / yenidən et + PNG ixracı düymələri. */
export function HistoryControls() {
  const { undo, redo, canUndo, canRedo } = useHistory();
  const exportPng = useCanvasApi((s) => s.exportPng);

  return (
    <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-panel">
      <IconButton title="Geri qaytar (Ctrl+Z)" onClick={undo} disabled={!canUndo}>
        <UndoIcon />
      </IconButton>
      <IconButton title="Yenidən et (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo}>
        <RedoIcon />
      </IconButton>
      <div className="mx-0.5 h-6 w-px bg-border" />
      <IconButton title="PNG ixrac et" onClick={() => exportPng?.()} disabled={!exportPng}>
        <DownloadIcon />
      </IconButton>
    </div>
  );
}
