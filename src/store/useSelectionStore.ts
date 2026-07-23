import { create } from 'zustand';

/**
 * Cari seçilmiş formaların id-ləri (yerli, per-user).
 * Seçim sinxronlaşmır — hər istifadəçinin öz seçimi var.
 */
interface SelectionState {
  selectedIds: string[];

  select: (ids: string[]) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: [],

  select: (ids) => set({ selectedIds: ids }),
  toggle: (id) => {
    const current = get().selectedIds;
    set({
      selectedIds: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    });
  },
  clear: () => set({ selectedIds: [] }),
}));
