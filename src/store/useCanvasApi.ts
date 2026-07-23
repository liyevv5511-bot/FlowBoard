import { create } from 'zustand';

/**
 * Kətanın imperativ əməllərini (məs. PNG ixracı) UI komponentlərinə açır.
 *
 * Canvas komponenti quraşdıqda `exportPng`-i qeydiyyatdan keçirir; Toolbar
 * kimi komponentlər onu Konva Stage-ə birbaşa referans olmadan çağıra bilir.
 */
interface CanvasApiState {
  exportPng: (() => void) | null;
  setExportPng: (fn: (() => void) | null) => void;
}

export const useCanvasApi = create<CanvasApiState>((set) => ({
  exportPng: null,
  setExportPng: (fn) => set({ exportPng: fn }),
}));
