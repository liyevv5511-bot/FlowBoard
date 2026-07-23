import { useEffect } from 'react';
import { useToolStore } from '../store/useToolStore';
import { useSelectionStore } from '../store/useSelectionStore';
import { useBoard } from '../collab/useBoard';
import { useHistory } from '../collab/useHistory';
import type { Tool } from '../types';

/** Klaviatura hərfi → alət uyğunluğu. */
const TOOL_KEYS: Record<string, Tool> = {
  v: 'select',
  r: 'rect',
  o: 'ellipse',
  a: 'arrow',
  p: 'pen',
  t: 'text',
  s: 'sticky',
};

/**
 * Qlobal klaviatura qısayolları.
 * Fokus mətn sahəsindədirsə (redaktə) qısayollar söndürülür ki, yazmağa mane olmasın.
 */
export function useKeyboardShortcuts() {
  const setTool = useToolStore((s) => s.setTool);
  const { selectedIds, clear } = useSelectionStore();
  const { removeShapes } = useBoard();
  const { undo, redo } = useHistory();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Mətn daxiletməsində qısayolları işə salmırıq.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const mod = e.metaKey || e.ctrlKey;

      // Geri qaytar / yenidən et.
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Digər mod-birləşmələrini (məs. kopyala) toxunmadan buraxırıq.
      if (mod) return;

      // Seçilmişi sil.
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          removeShapes(selectedIds);
          clear();
        }
        return;
      }

      // Seçimi ləğv et.
      if (e.key === 'Escape') {
        clear();
        return;
      }

      // Alət seçimi.
      const tool = TOOL_KEYS[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        setTool(tool);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [setTool, selectedIds, clear, removeShapes, undo, redo]);
}
